import { Mail, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function ResetPasswordEmailSent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sentCount, setSentCount] = useState(0);
  const { email, requestReestToken } = location.state || {};
  const [loading, setLoading] = useState(null);

  // if (!email) {
  //   return <Navigate to="/sign-in" />;
  // }

  async function resendToken() {
    setLoading(true);
    await requestReestToken(email);
    setLoading(false);
    setSentCount((prev) => prev + 1);
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-800 rounded-lg shadow-xl p-8">
        <div className="text-center">
          {/* Email Icon */}
          <div className="mx-auto w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
            <Mail size={32} className="text-blue-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">
            Check Your Email
          </h1>

          <p className="text-gray-300 mb-6">
            We've sent a password reset link to:
          </p>

          {/* Email Display */}
          <div className="bg-neutral-700 p-4 rounded-md mb-8">
            <p className="text-white text-center break-all font-medium">
              {email}
            </p>
          </div>

          <p className="text-gray-400 text-sm mb-8">
            Click the link in the email to reset your password. If you don't see
            the email, check your spam folder.
          </p>

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => navigate("/sign-in")}
              className="w-full py-3 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium transition duration-300 ease-in-out"
            >
              Back to Login
            </button>

            <button
              onClick={() => navigate("/sign-up")}
              className="w-full py-3 px-4 rounded-md bg-neutral-700 hover:bg-neutral-600 text-white font-medium transition duration-300 flex items-center justify-center"
            >
              <ArrowLeft size={18} className="mr-2" />
              Don't have an account?
            </button>
          </div>

          {/* Resend Link */}
          {!loading && sentCount < 1 && (
            <div className="text-center mt-8">
              <p className="text-sm text-gray-400">
                Didn't receive the email?{" "}
                <span
                  onClick={resendToken}
                  className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                >
                  Resend Link
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
