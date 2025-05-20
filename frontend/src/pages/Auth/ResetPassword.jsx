import { useState } from "react";
import { Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { variable } from "../../shared";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [tokenValid, setTokenValid] = useState(null);

  console.log(token);

  useEffect(() => {
    if (!token) {
      return navigate("/sign-in");
    }

    async function checkToken() {
      try {
        const response = await fetch(
          `${variable.API_URL}/auth/check-reset-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
            }),
          }
        );
        const data = await response.json();

        if (data.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setErrors({ general: data.message });
        }
      } catch (err) {
        console.log("Internal server error, ", err);
      }
    }
    checkToken();
  }, [token, navigate]);

  function validateForm() {
    const newErrors = {};

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleResetPassword() {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${variable.API_URL}/auth/change-user-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            newPassword: password,
          }),
        }
      );

      if (!response.ok) {
        console.log(response);
        if (response.status === 400) {
          setErrors({
            general: "Invalid or expired reset token",
          });
        } else {
          setErrors({
            general: "Failed to reset password",
          });
        }
        setIsLoading(false);
      } else {
        await response.json();
        setIsLoading(false);
        // Redirect to login page with success message
        navigate("/sign-in", {
          state: {
            message:
              "Password reset successful. You can now log in with your new password.",
          },
        });
      }
    } catch (err) {
      console.log("Internal server error: ", err);
      setErrors({
        general: "An unexpected error occurred",
      });
      setIsLoading(false);
    }
  }

  if (tokenValid === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <p className="text-center text-gray-400">Verifying link…</p>;
      </div>
    );
  }

  // If invalid, show error + link back to “forgot password”
  if (!tokenValid) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="p-20 bg-neutral-800 rounded-lg max-w-md mx-auto text-center">
          <p className="text-red-400 mb-4">{errors.general}</p>
          <button
            onClick={() => navigate("/sign-in")}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Back to login page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Reset Your Password
          </h1>
          <p className="text-gray-400 text-sm">
            Enter a new password for your account
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Display */}
          {/* <div className="bg-neutral-700 p-4 rounded-md">
            <p className="text-gray-300 text-sm font-medium">
              Resetting password for:
            </p>
            <div className="flex items-center mt-1">
              <Lock size={18} className="text-gray-400 mr-2" />
              <p className="text-white break-all text-sm">{email}</p>
            </div>
          </div> */}

          {/* General Error Message */}
          {errors.general && (
            <div className="flex items-center text-red-400 bg-red-400/10 p-3 rounded-md">
              <AlertCircle size={20} className="mr-2 flex-shrink-0" />
              <span className="text-sm">{errors.general}</span>
            </div>
          )}

          {/* New Password Input */}
          <div className="space-y-2 mb-10">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300 block"
            >
              New Password
            </label>
            <div className="relative h-12">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`bg-neutral-700 text-white text-sm rounded-md block w-full px-3 py-3 pr-10 border ${
                  errors.password ? "border-red-500" : "border-neutral-600"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <div className="flex items-center mt-1 text-red-400 text-sm">
                  <AlertCircle size={16} className="mr-1 flex-shrink-0" />
                  {errors.password}
                </div>
              )}
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2 mb-10">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-300 block"
            >
              Confirm Password
            </label>
            <div className="relative h-12">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`bg-neutral-700 text-white text-sm rounded-md block w-full px-3 py-3 pr-10 border ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-neutral-600"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && (
                <div className="flex items-center mt-1 text-red-400 text-sm">
                  <AlertCircle size={16} className="mr-1 flex-shrink-0" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          {/* Reset Password Button */}
          <div
            onClick={!isLoading ? handleResetPassword : undefined}
            className={`w-full py-3 px-4 rounded-md text-white font-medium text-center transition duration-300 ease-in-out ${
              isLoading
                ? "bg-blue-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 hover:shadow-lg cursor-pointer"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Resetting...</span>
              </div>
            ) : (
              "Reset Password"
            )}
          </div>
        </div>

        {/* Back to Login Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            Remember your password?{" "}
            <span
              onClick={() => navigate("/sign-in")}
              className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
            >
              Back to Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
