import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage({
  icon,
  title,
  description,
  currentPage,
  totalPages,
  onNext,
  isFinalPage,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  function login() {
    navigate("/home");
  }

  return (
    <div className="bg-transparent w-full max-w-md px-6 flex flex-col items-center">
      <div className="flex flex-col items-center gap-6 mb-10 w-full">
        <img src={icon} alt="" className="w-48 h-48 object-contain" />

        <div className="text-center">
          <p className="text-white font-semibold text-xl mb-2">{title}</p>
          <p className="text-sm text-gray-400 max-w-xs">{description}</p>
        </div>

        <div className="flex space-x-3 mt-4">
          {Array.from({ length: totalPages }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentPage - 1
                  ? "bg-blue-500 scale-125"
                  : "bg-white opacity-60 border border-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      <button
        aria-label="next button"
        className={`w-full max-w-xs py-3 rounded-md text-white font-semibold text-lg transition-all duration-300 ${
          isHovered ? "bg-blue-600 shadow-lg" : "bg-blue-500"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={isFinalPage ? login : onNext}
      >
        {isFinalPage ? "Get Started" : "Next"}
      </button>
    </div>
  );
}
