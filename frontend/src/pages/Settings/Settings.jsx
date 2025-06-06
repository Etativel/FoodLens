import {
  User,
  LogOut,
  Ruler,
  Weight,
  Pizza,
  Beef,
  Droplet,
  Wheat,
  Cookie,
  Apple,
  Crown,
  ShieldAlert,
  Trash2,
  Github,
  ChevronRight,
  Hamburger,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { variable } from "../../shared";
function Settings() {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const response = await fetch(`${variable.API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        console.log("Failed to logout: ", response.statusText);
      } else {
        await response.json();
        navigate("/sign-in");
        console.log("Logout success");
      }
    } catch (error) {
      console.log("Error loging out: ", error);
    }
  }

  function redirectToUpdateField(field) {
    navigate(`/settings/${field}`);
  }

  function upgradeUser() {
    alert("Upcoming feature");
  }

  return (
    <div className="flex flex-col h-screen lg:w-full">
      <div className="flex-1 overflow-y-auto bg-neutral-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none px-5 py-6 mb-15 lg:mb-0">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        {/* Account Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
            <User size={20} className="mr-2" />
            Account
          </h2>

          <div className="rounded-lg overflow-hidden bg-neutral-800">
            <button
              onClick={() => upgradeUser()}
              aria-label="height setting"
              className="border-b-1 border-b-neutral-700border-b-1 border-b-neutral-700 w-full flex items-center justify-between text-white p-4  transition"
            >
              <div className="flex items-center">
                <Crown size={18} className="mr-3 text-yellow-500" />
                <span>Upgrade to Premium</span>
              </div>
              <ChevronRight size={18} className="text-neutral-500" />
            </button>
            <button
              onClick={() => redirectToUpdateField("height")}
              aria-label="height setting"
              className="border-b-1 border-b-neutral-700 w-full flex items-center justify-between text-white p-4 hover:bg-neutral-700 transition"
            >
              <div className="flex items-center">
                <Ruler size={18} className="mr-3 text-neutral-400" />
                <span>Height</span>
              </div>
              <ChevronRight size={18} className="text-neutral-500" />
            </button>

            <button
              onClick={() => redirectToUpdateField("weight")}
              aria-label="weight setting"
              className="border-b-1 border-b-neutral-700 w-full flex items-center justify-between text-white p-4 hover:bg-neutral-700 transition"
            >
              <div className="flex items-center">
                <Weight size={18} className="mr-3 text-neutral-400" />
                <span>Weight</span>
              </div>
              <ChevronRight size={18} className="text-neutral-500" />
            </button>

            <button
              onClick={() => redirectToUpdateField("weightgoal")}
              aria-label="weight goal setting"
              className="border-b-1 border-b-neutral-700 w-full flex items-center justify-between text-white p-4 hover:bg-neutral-700 transition"
            >
              <div className="flex items-center">
                <Weight size={18} className="mr-3 text-neutral-400" />
                <span>Weight Goal</span>
              </div>
              <ChevronRight size={18} className="text-neutral-500" />
            </button>

            <button
              onClick={handleLogout}
              aria-label="log out"
              className="w-full flex items-center justify-between text-white p-4 hover:bg-neutral-700 transition"
            >
              <div className="flex items-center">
                <LogOut size={18} className="mr-3 text-neutral-400" />
                <span>Log out</span>
              </div>
              <ChevronRight size={18} className="text-neutral-500" />
            </button>
          </div>
        </section>

        {/* Nutrition Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
            <Pizza size={20} className="mr-2" />
            Nutrition Target
          </h2>

          <div className="rounded-lg overflow-hidden bg-neutral-800">
            <button
              onClick={() => redirectToUpdateField("calorietarget")}
              aria-label="calorie target setting"
              className="border-b-1 border-b-neutral-700 w-full flex items-center justify-between text-white p-4 hover:bg-neutral-700 transition"
            >
              <div className="flex items-center">
                <Pizza size={18} className="mr-3 text-neutral-400" />
                <span>Calories</span>
              </div>
              <ChevronRight size={18} className="text-neutral-500" />
            </button>

            <button
              onClick={() => redirectToUpdateField("sodium")}
              aria-label="sodium"
              className="border-b-1 border-b-neutral-700 w-full flex items-center justify-between text-white p-4 hover:bg-neutral-700 transition"
            >
              <div className="flex items-center">
                <Hamburger size={18} className="mr-3 text-neutral-400" />
                <span>Sodium</span>
              </div>
              <ChevronRight size={18} className="text-neutral-500" />
            </button>

            <button
              onClick={() => redirectToUpdateField("protein")}
              aria-label="protein"
              className="border-b-1 border-b-neutral-700 w-full flex items-center justify-between text-white p-4 hover:bg-neutral-700 transition"
            >
              <div className="flex items-center">
                <Beef size={18} className="mr-3 text-neutral-400" />
                <span>Protein</span>
              </div>
              <ChevronRight size={18} className="text-neutral-500" />
            </button>

            <button
              onClick={() => redirectToUpdateField("fat")}
              aria-label="fat"
              className="border-b-1 border-b-neutral-700 w-full flex items-center justify-between text-white p-4 hover:bg-neutral-700 transition"
            >
              <div className="flex items-center">
                <Droplet size={18} className="mr-3 text-neutral-400" />
                <span>Fat</span>
              </div>
              <ChevronRight size={18} className="text-neutral-500" />
            </button>

            <button
              onClick={() => redirectToUpdateField("carbohydrate")}
              aria-label="carbohydrate"
              className="border-b-1 border-b-neutral-700 w-full flex items-center justify-between text-white p-4 hover:bg-neutral-700 transition"
            >
              <div className="flex items-center">
                <Wheat size={18} className="mr-3 text-neutral-400" />
                <span>Carbohydrate</span>
              </div>
              <ChevronRight size={18} className="text-neutral-500" />
            </button>

            <button
              onClick={() => redirectToUpdateField("fiber")}
              aria-label="fiber"
              className="border-b-1 border-b-neutral-700 w-full flex items-center justify-between text-white p-4 hover:bg-neutral-700 transition"
            >
              <div className="flex items-center">
                <Cookie size={18} className="mr-3 text-neutral-400" />
                <span>Fiber</span>
              </div>
              <ChevronRight size={18} className="text-neutral-500" />
            </button>

            <button
              onClick={() => redirectToUpdateField("sugar")}
              aria-label="sugar"
              className="w-full flex items-center justify-between text-white p-4 hover:bg-neutral-700 transition"
            >
              <div className="flex items-center">
                <Apple size={18} className="mr-3 text-neutral-400" />
                <span>Sugar</span>
              </div>
              <ChevronRight size={18} className="text-neutral-500" />
            </button>
          </div>
        </section>

        {/* Github Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Github size={20} className="mr-2 text-white" />
            Visit our Github
          </h2>

          <div className="rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700 shadow-lg">
            <button
              onClick={() =>
                window.open("https://github.com/Etativel/FoodLens", "_blank")
              }
              aria-label="Visit GitHub repository"
              className="w-full flex items-center justify-between text-white p-4 hover:bg-neutral-700 transition-colors duration-200 group"
            >
              <div className="flex items-center">
                <Github
                  size={20}
                  className="mr-3 text-neutral-400 group-hover:text-white transition-colors duration-200"
                />
                <div className="flex flex-col items-start">
                  <span className="text-white font-medium">
                    View Source Code
                  </span>
                  <span className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors duration-200">
                    Explore our open source project
                  </span>
                </div>
              </div>
              <ChevronRight
                size={18}
                className="text-neutral-500 group-hover:text-neutral-300 transition-colors duration-200"
              />
            </button>
          </div>
        </section>

        {/* Access Section */}
        {/* <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
            <ShieldAlert size={20} className="mr-2" />
            Access
          </h2>

          <div className="rounded-lg overflow-hidden bg-neutral-800">
            <button
              aria-label="delete account"
              className="w-full flex items-center justify-between text-white p-4 hover:bg-neutral-700 transition"
            >
              <div className="flex items-center">
                <Trash2 size={18} className="mr-3 text-red-500" />
                <span className="text-red-500">Delete account</span>
              </div>
              <ChevronRight size={18} className="text-neutral-500" />
            </button>
          </div>
        </section> */}
      </div>
    </div>
  );
}

export default Settings;
