import { useState } from "react";
import OnboardingPage from "../../components/Onboarding/OnboardingPages";

import pageOne from "../../assets/svg/page-1.svg";
import PageTwo from "../../assets/svg/page-2.svg";
import pageThree from "../../assets/svg/page-3.svg";

const pages = [
  {
    id: 1,
    icon: pageOne,
    title: "Instant Food Recognition",
    description:
      "Point your camera at any dish and get instant identification in seconds.",
  },
  {
    id: 2,
    icon: PageTwo,
    title: "Smart Nutrition Tracker",
    description:
      "Snap photos of your meals to automatically log calories, macros, and more.",
  },
  {
    id: 3,
    icon: pageThree,
    title: "Start Your Food Journey",
    description: "Explore and discover new foods from all around the world.",
  },
];

function Onboarding() {
  const [currentPage, setCurrentPage] = useState(1);

  const handleNext = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    } else {
      setCurrentPage(1);
    }
  };

  const currentPageData = pages.find((page) => page.id === currentPage);

  return (
    <div className="h-screen w-full bg-neutral-900 flex justify-center items-center p-4">
      <OnboardingPage
        icon={currentPageData.icon}
        title={currentPageData.title}
        description={currentPageData.description}
        currentPage={currentPage}
        totalPages={pages.length}
        onNext={handleNext}
        isFinalPage={currentPage === pages.length}
      />
    </div>
  );
}

export default Onboarding;
