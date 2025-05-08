import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, User, AlertCircle } from "lucide-react";
import googleIcon from "../../assets/svg/google.svg";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    console.log("passed validation");
    setIsLoading(true);

    try {
      console.log("Creating user");
      const response = await fetch("http://localhost:3000/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userData: { email, fullName, password },
        }),
      });

      if (!response.ok) {
        setIsLoading(false);
        console.log(response.statusText);
        return;
      } else {
        await response.json();
        try {
          const response = await fetch("http://localhost:3000/auth/login", {
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
          setIsLoading(false);
          navigate("/home");
        } catch (err) {
          console.log(err);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-gray-400 text-sm">
            Begin your food discovery journey
          </p>
        </div>

        <div className="space-y-6">
          {/* Full Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-300 block"
            >
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="fullName"
                className={`bg-neutral-700 text-white text-sm rounded-md block w-full pl-10 pr-3 py-3 border ${
                  errors.fullName ? "border-red-500" : "border-neutral-600"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.fullName}
                </div>
              )}
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-300 block"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                className={`bg-neutral-700 text-white text-sm rounded-md block w-full pl-10 pr-3 py-3 border ${
                  errors.email ? "border-red-500" : "border-neutral-600"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-300 block"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`bg-neutral-700 text-white text-sm rounded-md block w-full pl-10 pr-10 py-3 border ${
                  errors.password ? "border-red-500" : "border-neutral-600"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff
                    size={18}
                    className="text-gray-400 hover:text-gray-300"
                  />
                ) : (
                  <Eye
                    size={18}
                    className="text-gray-400 hover:text-gray-300"
                  />
                )}
              </div>
              {errors.password && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.password}
                </div>
              )}
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-300 block"
            >
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className={`bg-neutral-700 text-white text-sm rounded-md block w-full pl-10 pr-10 py-3 border ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-neutral-600"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff
                    size={18}
                    className="text-gray-400 hover:text-gray-300"
                  />
                ) : (
                  <Eye
                    size={18}
                    className="text-gray-400 hover:text-gray-300"
                  />
                )}
              </div>
              {errors.confirmPassword && (
                <div className="flex items-center mt-1 text-red-500 text-xs">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.confirmPassword}
                </div>
              )}
            </div>
          </div>

          {/* Signup Button */}
          <div
            onClick={!isLoading ? handleSubmit : undefined}
            className={`w-full py-3 px-4 rounded-md text-white font-medium text-center transition duration-300 ease-in-out ${
              isLoading
                ? "bg-blue-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 hover:shadow-lg cursor-pointer"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                <span>Creating account...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </div>
        </div>

        {/* Login Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            Already have account?{" "}
            <a
              href="/sign-in"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign In
            </a>
          </p>
        </div>

        {/* Social Signup Options */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-800 text-gray-400">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <div className="py-3 px-4 rounded-md border border-neutral-600 bg-neutral-700 text-gray-300 text-sm font-medium hover:bg-neutral-600 transition-all flex items-center justify-center cursor-pointer">
              <img className="size-6 mx-2" src={googleIcon} alt="" />
              Google
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
