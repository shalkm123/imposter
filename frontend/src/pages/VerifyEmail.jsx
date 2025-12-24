import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Mail, Lock, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [emailVerifyId, setEmailVerifyId] = useState(""); // ✅ NEW
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // 'success', 'error', 'info'
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const e = location.state?.email || "";
    const vId = location.state?.emailVerifyId || "";
    setEmail(e);
    setEmailVerifyId(vId);
  }, [location.state]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("");
    setLoading(true);

    const otpString = otp.join("");

    // ✅ Must have verifyId to know which signup session this OTP belongs to
    if (!emailVerifyId) {
      setMsg("Verification session missing. Please go back to signup and try again.");
      setMsgType("error");
      setLoading(false);
      return;
    }

    // Validate OTP is complete
    if (otpString.length !== 6) {
      setMsg("Please enter all 6 digits");
      setMsgType("error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ OTP based verification (no email)
        body: JSON.stringify({ emailVerifyId, otp: otpString }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "OTP expired") {
          setMsg("OTP has expired. Please request a new one.");
          setMsgType("error");
        } else if (data.message === "Invalid OTP") {
          setMsg("Incorrect OTP. Please check and try again.");
          setMsgType("error");
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        } else if (data.message === "Invalid verification session") {
          setMsg("Verification session is invalid/expired. Please sign up again.");
          setMsgType("error");
        } else {
          setMsg(data?.message || "OTP verification failed");
          setMsgType("error");
        }
        setLoading(false);
        return;
      }

      // ✅ Success! Email verified
      setVerified(true);
      setMsg("✓ Email verified successfully!");
      setMsgType("success");

      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Email verified! Please login to continue.",
            email: email || "",
          },
        });
      }, 2000);
    } catch (err) {
      console.error("Verification error:", err);
      setMsg("Network error. Please check your connection and try again.");
      setMsgType("error");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    // Resend still needs email to send OTP
    if (!email) {
      setMsg("Email missing. Please go back to signup to request OTP again.");
      setMsgType("error");
      return;
    }

    setMsg("");
    setMsgType("");
    setLoading(true);

    // Clear existing OTP
    setOtp(["", "", "", "", "", ""]);

    try {
      const res = await fetch("http://localhost:5000/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Email already verified") {
          setMsg("Your email is already verified. Redirecting to login...");
          setMsgType("info");
          setTimeout(() => navigate("/login"), 1500);
          return;
        }
        setMsg(data?.message || "Failed to resend OTP");
        setMsgType("error");
        setLoading(false);
        return;
      }

      // ✅ update verify session id if backend returns new one
      if (data?.emailVerifyId) {
        setEmailVerifyId(data.emailVerifyId);
      }

      setMsg("✓ New OTP sent to your email. Please check your inbox.");
      setMsgType("success");

      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      console.error("Resend error:", err);
      setMsg("Network error. Please try again.");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (msg && msgType === "error") {
      setMsg("");
      setMsgType("");
    }

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }

    if (e.key === "Enter" && otp.every((digit) => digit !== "")) {
      handleVerify(e);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, 6);

    if (!/^\d+$/.test(pastedData)) {
      setMsg("Please paste a valid 6-digit OTP");
      setMsgType("error");
      return;
    }

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();

    if (msg) {
      setMsg("");
      setMsgType("");
    }
  };

  const getMessageStyle = () => {
    switch (msgType) {
      case "success":
        return "bg-green-500/20 border border-green-400/50 text-green-200";
      case "error":
        return "bg-red-500/20 border border-red-400/50 text-red-200";
      case "info":
        return "bg-blue-500/20 border border-blue-400/50 text-blue-200";
      default:
        return "bg-purple-500/20 border border-purple-400/50 text-purple-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 p-8 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Verify Email
          </h1>
          <p className="text-purple-200 text-lg">
            Check your inbox for the verification code
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          {/* ✅ If verifyId missing: show session error (this happens on refresh) */}
          {!emailVerifyId ? (
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <AlertCircle size={64} className="text-yellow-400" />
              </div>
              <p className="text-purple-200 text-lg mb-6">
                Verification session missing. Please go back to signup and try again.
              </p>
              <button
                onClick={() => navigate("/signup")}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 
                hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl 
                font-semibold transition-all transform hover:scale-105"
              >
                Back to Signup
              </button>
            </div>
          ) : (
            <>
              {/* EMAIL INFO (optional) */}
              {email ? (
                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-purple-300/30">
                  <div className="flex items-center gap-2 text-purple-200 mb-2">
                    <Mail size={20} />
                    <span className="font-medium">Verification sent to:</span>
                  </div>
                  <p className="text-white font-semibold text-lg ml-7 break-all">
                    {email}
                  </p>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-yellow-500/10 rounded-xl border border-yellow-300/30">
                  <div className="flex items-center gap-2 text-yellow-200 mb-2">
                    <AlertCircle size={20} />
                    <span className="font-medium">Email not shown</span>
                  </div>
                  <p className="text-yellow-100 text-sm ml-7">
                    You can still verify using OTP.
                  </p>
                </div>
              )}

              {/* OTP INPUT BOXES */}
              <form onSubmit={handleVerify} className="space-y-6">
                <div>
                  <label className="block text-purple-200 mb-3 text-lg font-medium flex items-center gap-2">
                    <Lock size={20} /> Enter 6-Digit OTP
                  </label>
                  <div className="flex gap-3 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={verified || loading}
                        className="w-14 h-16 bg-white/20 border-2 border-purple-300/50 
                        rounded-xl text-white text-center text-2xl font-bold
                        focus:outline-none focus:border-purple-400 focus:bg-white/25 
                        focus:ring-2 focus:ring-purple-400/50 transition-all
                        disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    ))}
                  </div>
                  <p className="text-purple-300 text-sm text-center mt-3">
                    OTP expires in 10 minutes
                  </p>
                </div>

                {/* VERIFY BUTTON */}
                <button
                  type="submit"
                  disabled={loading || verified || otp.some((digit) => digit === "")}
                  className={`w-full px-8 py-4 rounded-xl font-bold text-xl 
                  flex items-center justify-center gap-3 transition-all transform ${
                    !loading && !verified && otp.every((digit) => digit !== "")
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-2xl hover:scale-105 cursor-pointer"
                      : "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <CheckCircle size={24} />
                  <span>
                    {loading ? "Verifying..." : verified ? "Verified!" : "Verify Email"}
                  </span>
                </button>
              </form>

              {/* RESEND BUTTON (only if email exists) */}
              {!verified && (
                <div className="mt-6">
                  <button
                    onClick={handleResend}
                    disabled={loading || !email}
                    className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 
                    border border-purple-300/50 rounded-xl text-purple-200 
                    hover:text-white font-semibold text-lg transition-all
                    flex items-center justify-center gap-2 disabled:opacity-50 
                    disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
                    <span>Resend OTP</span>
                  </button>

                  {!email ? (
                    <p className="text-yellow-200 text-sm text-center mt-2">
                      Resend needs email. Go back to signup.
                    </p>
                  ) : (
                    <p className="text-purple-300 text-sm text-center mt-2">
                      Didn't receive the code? Check spam folder
                    </p>
                  )}
                </div>
              )}

              {/* MESSAGE */}
              {msg && (
                <div className={`mt-6 p-4 rounded-xl text-center font-medium ${getMessageStyle()}`}>
                  {msg}
                </div>
              )}
            </>
          )}

          {/* BACK TO LOGIN LINK */}
          {emailVerifyId && !verified && (
            <div className="mt-6 text-center pt-6 border-t border-white/10">
              <p className="text-purple-200 mb-3">Already verified?</p>
              <button
                onClick={() => navigate("/login")}
                className="text-purple-300 hover:text-white font-semibold text-lg 
                transition-colors underline decoration-2 underline-offset-4"
              >
                Login here
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
