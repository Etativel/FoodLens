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
  ShieldAlert,
  Trash2,
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

  return (
    <div className="flex flex-col h-screen lg:max-w-[500px] md:max-w-[500px]">
      <div className="flex-1 overflow-y-auto bg-neutral-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none px-5 py-6 mb-15">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        {/* Account Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center">
            <User size={20} className="mr-2" />
            Account
          </h2>

          <div className="rounded-lg overflow-hidden bg-neutral-800">
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
