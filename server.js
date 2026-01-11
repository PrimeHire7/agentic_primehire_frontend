import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { chromium } from "playwright";
import fetch from "node-fetch";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const FASTAPI_URL = process.env.FASTAPI_URL || "http://54.167.210.32:8000";

// Path to save persistent login state
const STORAGE_STATE = path.join(process.cwd(), "zoho_state.json");

// Endpoint for Zoho login via Playwright
app.post("/auth/zoho", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ error: "Missing credentials" });

    try {
        // Launch browser for login
        const browser = await chromium.launch({ headless: false });
        const context = await browser.newContext();
        const loginPage = await context.newPage();

        console.log("Navigating to Zoho login page...");
        await loginPage.goto("https://accounts.zoho.com/signin", { waitUntil: "domcontentloaded" });

        await loginPage.fill("#login_id", email);
        await loginPage.click("#nextbtn");

        await loginPage.waitForSelector("#password", { timeout: 30000 });
        await loginPage.fill("#password", password);
        await loginPage.click('//button[.//span[text()="Sign in"]]');

        // Save login state
        await context.storageState({ path: STORAGE_STATE });
        console.log("Login state saved.");

        // OAuth flow
        const oauthContext = await chromium.launchPersistentContext(STORAGE_STATE, { headless: false });
        const oauthPage = await oauthContext.newPage();
        const oauthUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=ZohoRecruit.modules.ALL&client_id=1000.7EDK5QI3TSUU214UOL80N0VMWKMKYO&response_type=code&access_type=offline&redirect_uri=${FASTAPI_URL}/callback&prompt=consent`;

        console.log("Opening OAuth URL:", oauthUrl);
        await oauthPage.goto(oauthUrl, { waitUntil: "domcontentloaded" });

        try {
            await oauthPage.waitForSelector('//button[contains(@class, "submitApproveForm")]', { timeout: 30000 });
            await oauthPage.click('//button[contains(@class, "submitApproveForm")]');
            console.log("Consent approved.");
        } catch {
            console.log("No consent prompt.");
        }

        // Wait for redirect
        await oauthPage.waitForURL(new RegExp(`${FASTAPI_URL}/callback`), { timeout: 20000 });
        const code = new URL(oauthPage.url()).searchParams.get("code");

        await browser.close();

        if (!code) return res.status(500).json({ error: "Auth code not found" });

        // Send code to FastAPI for token storage
        const callbackResp = await fetch(`${FASTAPI_URL}/callback?code=${code}&email=${encodeURIComponent(email)}`);
        const callbackData = await callbackResp.json();

        if (!callbackResp.ok)
            return res.status(500).json({ error: "Failed to save tokens", details: callbackData });

        console.log(`Tokens saved for ${email}`);
        res.json({ message: "Zoho auth successful", data: callbackData });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Zoho automation failed", details: err.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Node server running on port ${PORT}`));
