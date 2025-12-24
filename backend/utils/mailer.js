import { Resend } from "resend";

let resendClient = null;

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY missing");
  }
  if (!resendClient) resendClient = new Resend(process.env.RESEND_API_KEY);
  return resendClient;
}

export async function sendOtpEmail(to, otp) {
  const resend = getResend();

  const result = await resend.emails.send({
    from: process.env.FROM_EMAIL || "onboarding@resend.dev",
    to,
    subject: "Verify your email (OTP)",
    html: `<h2>Your OTP is</h2><h1>${otp}</h1><p>Expires in 10 minutes.</p>`,
  });

  console.log("📬 RESEND RESULT:", result);

  // If Resend returns an error, throw it so your controller can show 500
  if (result?.error) {
    throw new Error(result.error.message || "Resend failed");
  }

  return result;
}
