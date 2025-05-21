import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function NotFoundPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (countdown <= 0) {
      navigate("/home");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 px-4 text-center">
      <div className="w-full max-w-md">
        {/* 404 Error Animation */}
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-blue-500 opacity-10 animate-pulse">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl font-bold text-white">404</div>
          </div>
        </div>

        {/* Error message */}
        <h1 className="text-2xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-gray-400 mb-8">
          Oops! The page you're looking for doesn't seem to exist.
        </p>

        <div className="relative p-4 mx-auto mb-8 w-64 h-32 flex justify-center items-center">
          <span className="absolute top-0 left-0 w-8 h-8 border-t-2 rounded-tl-lg border-l-2 border-gray-500"></span>
          <span className="absolute top-0 right-0 w-8 h-8 rounded-tr-lg border-t-2 border-r-2 border-gray-500"></span>
          <span className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg border-gray-500"></span>
          <span className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-lg border-gray-500"></span>

          <div className="text-gray-300 text-center">
            <p className="text-sm">Nothing to scan here!</p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => navigate("/home")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
          >
            Go Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="bg-neutral-700 hover:bg-neutral-600 text-gray-200 py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
          >
            Go Back
          </button>

          <p className="text-gray-500 mt-4">
            Redirecting to home in{" "}
            <span className="text-blue-500 font-bold">{countdown}</span>{" "}
            seconds...
          </p>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
