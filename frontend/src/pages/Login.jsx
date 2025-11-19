import { useState } from "react";
import { Users, Lock, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ------------------ LOGIN FUNCTION ------------------ //
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  // If backend sends any error status (400/401) → go to signup
  if (!res.ok) {
    alert(data.message || "User not found. Redirecting to signup...");
    navigate("/signup");
    return;
  }

  // SUCCESS: data = { message: "Login successful", token }
  localStorage.setItem("token", data.token);
  localStorage.setItem("email", email); // Save email manually

  alert("Login successful!");
  navigate("/names");   // Go to PlayerNames.jsx

} catch (err) {
  console.error(err);
  alert("Server error. Try again later.");
}

  };

  const isFormValid = () => {
    return email.trim() !== "" && password.trim() !== "";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8 flex items-center justify-center">
      <div className="max-w-md w-full">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-purple-200 text-lg">Login to continue your game</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="space-y-6">

            {/* email */}
            <div>
              <label className="block text-purple-200 mb-3 text-lg font-medium flex items-center gap-2">
                <Users size={20} />
                email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your email"
                className="w-full px-6 py-4 bg-white/20 border-2 border-purple-300/50 
                rounded-xl text-white placeholder-purple-300/60 text-lg 
                focus:outline-none focus:border-purple-400 focus:bg-white/25 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-purple-200 mb-3 text-lg font-medium flex items-center gap-2">
                <Lock size={20} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className="w-full px-6 py-4 bg-white/20 border-2 border-purple-300/50 
                rounded-xl text-white placeholder-purple-300/60 text-lg 
                focus:outline-none focus:border-purple-400 focus:bg-white/25 transition-all"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
              disabled={!isFormValid()}
              className={`w-full px-8 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-3 
              transition-all transform ${
                isFormValid()
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl hover:scale-105 cursor-pointer"
                  : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
              }`}
            >
              <LogIn size={24} />
              <span>Login</span>
            </button>
          </div>

          {/* Signup Redirect */}
          <div className="mt-6 text-center">
            <p className="text-purple-200 mb-3">Don't have an account?</p>
            <button
              onClick={() => navigate("/signup")}
              className="text-purple-300 hover:text-white font-semibold text-lg 
              transition-colors underline decoration-2 underline-offset-4"
            >
              Sign up here
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
