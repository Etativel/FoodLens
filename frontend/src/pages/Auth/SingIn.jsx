import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import googleIcon from "../../assets/svg/google.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  useEffect(() => {
    fetch("http://localhost:3000/auth/profile", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not authenticated");
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  async function validateUserLogin(credential, password) {
    const errors = {};

    if (!credential) {
      errors.credentialError = "Email or username is required.";
    } else {
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (credential.includes("@") && !emailRegex.test(credential)) {
        errors.credentialError = "Invalid email address.";
      }
    }

    if (!password) {
      errors.passwordError = "Password is required.";
    } else if (password.length < 6) {
      errors.passwordError = "Password must be at least 6 characters.";
    }
    return errors;
  }

  const handleSubmit = async (e) => {
    setErrors({});
    e.preventDefault();
    setIsValidating(true);
    const loginErrors = validateUserLogin(email, password);
    if (Object.keys(loginErrors).length > 0) {
      setIsValidating(false);
      setErrors(loginErrors);

      return;
    }

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
        const errorData = await response.json();
        const message = errorData.message || "Login error";
        // console.log(message);
        if (message.toLowerCase().includes("not registered")) {
          setErrors({ emailError: message });
        } else if (message.toLowerCase().includes("incorrect password")) {
          setErrors({ passwordError: message });
        } else if (
          message.toLowerCase().includes("your account has been suspended")
        ) {
          setErrors({ suspendedError: message });
        } else {
          setErrors({ loginError: message });
        }
        setIsValidating(false);
        return;
      }
      setIsLoading(false);
      navigate("/home");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-sm">
            Sign in to continue your food journey
            {errors.passwordError}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="bg-neutral-700 text-white text-sm rounded-md block w-full pl-10 pr-3 py-3 border border-neutral-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="example@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.emailError && (
              <div className="flex gap-2">
                <span className="error-exclamation"></span>
                <p className="font-sm text-red-400">{errors.emailError}</p>
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300 block"
              >
                Password
              </label>
              {/* <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
                Forgot password?
              </a> */}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="bg-neutral-700 text-white text-sm rounded-md block w-full pl-10 pr-10 py-3 border border-neutral-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
              </button>
            </div>
            {errors.passwordError && (
              <div className="flex gap-2">
                <span className="error-exclamation"></span>
                <p className="font-sm text-red-400">{errors.passwordError}</p>
              </div>
            )}
          </div>

          {/* Remember Me Checkbox */}
          {/* <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-neutral-700"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-300"
            >
              Remember me
            </label>
          </div> */}

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading || isValidating}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition duration-300 ease-in-out mt-2  ${
              isLoading || isValidating
                ? "bg-blue-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 hover:shadow-lg"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <a
              href="/sign-up"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Sign up
            </a>
          </p>
        </div>

        {/* Social Login Options */}
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-800 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <button
              type="button"
              className="py-3 px-4 rounded-md border border-neutral-600 bg-neutral-700 text-gray-300 text-sm font-medium hover:bg-neutral-600 transition-all flex items-center justify-center"
            >
              <img className="size-6 mx-2" src={googleIcon} alt="" />
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
