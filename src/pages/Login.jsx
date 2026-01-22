import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import logo from "@/assets/primehire_logo.png";
import { FaUserAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa";



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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-gradient-blue  from-slate-100 to-slate-200">
      <Card className="w-[560px] shadow-xl rounded-2xl card_out">
        <CardHeader className="text-center p-0">
          <CardTitle className="text-2xl font-semibold text-slate-800">
            {/* PrimeHire AI */}
            <Link to="/" className="ph-logo-wrap">
          <img src={logo} alt="PrimeHire" className="ph-logo" />
        </Link>
          </CardTitle>
          <h6 className="text-sm text-slate-500">
            Sign in to continue
          </h6>
        </CardHeader>

        <CardContent className="space-y-4 p-0">
          <div className="p-relative">
          <FaUserAlt />
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            </div>

          <div className="p-relative">
          <FaLock />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
</div>
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button className="w-full rounded-xl btnn" onClick={handleLogin}>
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
