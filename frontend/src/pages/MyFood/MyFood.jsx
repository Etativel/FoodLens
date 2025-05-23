import SearchBar from "../../components/SearchBar/SearchBar";
import { ClipboardList, Trash2 } from "lucide-react";
import { Loader, variable } from "../../shared";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../../contexts/createContext/UserContext";

export default function MyFood() {
  const { profile } = useContext(UserContext);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [scanHistory, setScanHistory] = useState([]);

  useEffect(() => {
    if (!profile) return;
    async function fetchScanHistory() {
      try {
        const response = await fetch(`${variable.API_URL}/user/scan-history`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: profile.user.id,
          }),
        });
        if (!response.ok) {
          console.log("Failed to retrieve scan history, ", response.statusText);
        }
        const { scans } = await response.json();
        setScanHistory(scans);
        setLoading(false);
      } catch (err) {
        console.log("Internal server error, ", err);
      }
    }
    fetchScanHistory();
  }, [profile]);

  useEffect(() => {
    if (!scanHistory) return;
    const lower = filter.trim().toLowerCase();

    if (!lower) {
      setFilteredData(scanHistory);
    }

    const matches = scanHistory.filter((items) => {
      const { name, summary, badgeKeys } = items.recipe;
      if (
        name.toLowerCase().includes(lower) ||
        summary.toLowerCase().includes(lower)
      ) {
        return true;
      }
      return badgeKeys.some((b) => b.toLowerCase().includes(lower));
    });
    setFilteredData(matches);
  }, [filter, scanHistory]);

  function handleDeleteScan(scanId) {
    setScanHistory((prev) => prev.filter((item) => item.id !== scanId));
  }

  if (loading) {
    return <Loader />;
  }

  if (!loading && scanHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-white mt-50 mx-4 text-center">
        <ClipboardList size={48} className="text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">My Foods </h2>
        <p className="text-gray-400 mb-6">
          This page keeps track of all foods you've scanned for easy reference.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen lg:w-full ">
      <div className="flex-1 overflow-y-auto bg-neutral-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -ms-overflow-style:none">
        <div className="flex flex-col bg-neutral-900 sticky z-10 top-0 h-10 justify-end">
          <div className="transform translate-y-1/2">
            <SearchBar
              filter={filter}
              setFilter={setFilter}
              name={"Search for history"}
            />
          </div>
        </div>
        <div className="lg:flex lg:flex-col lg:items-center">
          {scanHistory?.length >= 1 && (
            <FoodContent foods={filteredData} onDeleteScan={handleDeleteScan} />
          )}
        </div>
      </div>
    </div>
  );
}

function FoodContent({ foods, onDeleteScan }) {
  const navigate = useNavigate();
  function redirectToDetails(id, recipe, image) {
    navigate(`/scan/${id}`, {
      state: { recipe, image },
    });
  }
  return (
    <div className="flex mx-3 flex-col mb-25">
      <div className="text-white mb-2 text-lg font-semibold mt-10">
        Your scan history
      </div>
      <div className="flex flex-col gap-2">
        {foods.map((food, idx) => (
          <FoodCard
            key={idx}
            food={food}
            redirectToDetails={redirectToDetails}
            onDeleteScan={onDeleteScan}
          />
        ))}
      </div>
    </div>
  );
}

function FoodCard({ food, redirectToDetails, onDeleteScan }) {
  const [showNutrient, setShowNutrient] = useState(false);
  const [loading, setLoading] = useState(false);

  async function deleteScan(scanId) {
    try {
      setLoading(true);
      const response = await fetch(
        `${variable.API_URL}/food-api/delete-scan/${scanId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.log("Failed to delete scan, ", response.statusText);
        setLoading(false);
        return;
      }
      await response.json();
      setLoading(false);
      onDeleteScan(scanId);
      setShowNutrient(false);
    } catch (err) {
      console.log("Internal server error, ", err);
      setLoading(false);
    }
  }
  return (
    <div className="flex gap-4 items-start">
      <div
        onClick={() => redirectToDetails(food.id, food.recipe, food.imageUrl)}
        className="h-20 w-[150px] min-w-[100px] bg-cover bg-center rounded-lg mt-2"
        style={{ backgroundImage: `url(${food.imageUrl})` }}
      ></div>

      <div className="flex flex-col justify-center text-white max-w-xs overflow-hidden">
        <div className="flex justify-between">
          <span
            onClick={() =>
              redirectToDetails(food.id, food.recipe, food.imageUrl)
            }
            className="text-lg font-semibold truncate pr-2"
          >
            {food.recipe.name}
          </span>
          <button
            aria-label="show dropdown"
            onClick={() => setShowNutrient((prev) => !prev)}
          >
            {showNutrient ? (
              <ChevronUp className="w-5 h-5 text-white" strokeWidth={2.5} />
            ) : (
              <ChevronDown className="w-5 h-5 text-white" strokeWidth={2.5} />
            )}
          </button>
        </div>

        <span
          onClick={() => redirectToDetails(food.id, food.recipe, food.imageUrl)}
          className="text-sm text-gray-300"
        >
          <p>{food.recipe.summary}</p>
          <p className="text-sm text-neutral-400">
            {new Date(food.scannedAt).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </span>
        <div
          className={`flex flex-col gap-2 mt-1 ${showNutrient ? "" : "hidden"}`}
        >
          <div className="flex flex-wrap gap-2 mt-1">
            {food.recipe.nutritionItems &&
              food.recipe.nutritionItems.map((item) => {
                let borderColor = "border-gray-400";
                switch (item.name.toLowerCase()) {
                  case "protein":
                    borderColor = "border-blue-400";
                    break;
                  case "carbs":
                    borderColor = "border-yellow-400";
                    break;
                  case "fat":
                    borderColor = "border-green-400";
                    break;
                  case "calories":
                    borderColor = "border-red-400";
                    break;
                  case "sodium":
                    borderColor = "border-purple-400";
                    break;
                  case "fiber":
                    borderColor = "border-teal-400";
                    break;
                  case "sugar":
                    borderColor = "border-pink-400";
                    break;
                }

                return (
                  <div
                    key={`${item.name}-${item.value}-${item.unit}`}
                    className={`bg-gray-800 border ${borderColor} px-3 py-1 rounded-full text-xs font-medium ${
                      showNutrient ? "" : "hidden"
                    }`}
                  >
                    {item.name}: {item.value}
                    {item.unit}
                  </div>
                );
              })}
          </div>
          <button
            key={food.id}
            onClick={() => deleteScan(food.id)}
            disabled={loading}
            className={`bg-red-500 text-white p-2 rounded-lg transition-colors duration-200 flex items-center justify-center ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
            }`}
          >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
