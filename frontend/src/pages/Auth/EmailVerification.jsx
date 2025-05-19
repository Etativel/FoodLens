import { useState } from "react";
import { Mail, AlertCircle } from "lucide-react";
import { variable } from "../../shared";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function EmailVerification() {
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { email, fullName, password } = location.state || {};

  console.log(errors);

  if (!email) {
    return <Navigate to="/sign-up" />;
  }

  function validateForm() {
    const newErrors = {};
    if (!verificationCode.trim())
      newErrors.code = "Verification code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleVerify() {
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${variable.API_URL}/auth/verify-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          fullName,
          password,
          code: verificationCode,
        }),
      });
      if (!response.ok) {
        console.log(response);
        if (response.status === 400) {
          setErrors({ code: "Invalid or expired code" });
        }
        setIsLoading(false);
        console.log("Failed to verify code, ", response.statusText);
      } else {
        await response.json();
        try {
          const response = await fetch(`${variable.API_URL}/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              credential: email,
              password,
            }),
          });
          if (!response.ok) {
            setIsLoading(false);
            console.log(response.statusText);
            return;
          }
          await response.json();
          setIsLoading(false);
          navigate("/onboarding");
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log("Internal server error, ", err);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-400 text-sm">
            Enter the verification code sent to your email
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Display */}
          <div className="bg-neutral-700 p-4 rounded-md">
            <p className="text-gray-300 text-sm font-medium">
              Verification code sent to:
            </p>
            <div className="flex items-center mt-1">
              <Mail size={18} className="text-gray-400 mr-2" />
              <p className="text-white break-all text-sm">{email}</p>
            </div>
          </div>

          {/* Verification Code Input */}
          <div className="space-y-2">
            <label
              htmlFor="verificationCode"
              className="text-sm font-medium text-gray-300 block"
            >
              Verification Code
            </label>
            <div className="relative">
              <input
                type="text"
                id="verificationCode"
                className={`bg-neutral-700 text-white text-sm rounded-md block w-full px-3 py-3 border ${
                  errors.code ? "border-red-500" : "border-neutral-600"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                placeholder="Enter verification code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              {errors.code && (
                <div className="flex items-center mt-1 text-red-400 text-md">
                  <AlertCircle size={20} className="mr-1" />
                  {errors.code}
                </div>
              )}
            </div>
          </div>

          {/* Verify Button */}
          <div
            onClick={!isLoading ? handleVerify : undefined}
            className={`w-full py-3 px-4 rounded-md text-white font-medium text-center transition duration-300 ease-in-out ${
              isLoading
                ? "bg-blue-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 hover:shadow-lg cursor-pointer"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Verifying...</span>
              </div>
            ) : (
              "Verify"
            )}
          </div>
        </div>

        {/* Resend Code Link */}
        {/* <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            Didn't receive a code?{" "}
            <span className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer">
              Resend Code
            </span>
          </p>
        </div> */}
      </div>
    </div>
  );
}
