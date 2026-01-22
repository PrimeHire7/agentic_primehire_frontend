import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STATIC_USER = {
  username: "admin",
  password: "primehire123",
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (
      username === STATIC_USER.username &&
      password === STATIC_USER.password
    ) {
      sessionStorage.setItem("isLoggedIn", "true");
      navigate("/", { replace: true });
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <Card className="w-[360px] shadow-xl rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-slate-800">
            PrimeHire AI
          </CardTitle>
          <p className="text-sm text-slate-500">
            Sign in to continue
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button className="w-full rounded-xl" onClick={handleLogin}>
            Login
          </Button>

          <p className="text-xs text-center text-slate-400">
            © PrimeHire AI
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
