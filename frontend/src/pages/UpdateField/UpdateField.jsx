import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

// src/config/settingsFields.js
import {
  Ruler,
  Weight,
  Pizza,
  Hamburger,
  Beef,
  Droplet,
  Wheat,
  Cookie,
  Apple,
} from "lucide-react";
import { useContext } from "react";
import UserContext from "../../contexts/createContext/UserContext";

const settingsFields = {
  weightgoal: {
    label: "Weight Goal",
    unit: "kg",
    icon: Weight,
    type: "number",
    min: 10,
    max: 550,
    fieldName: "weightgoal",
    endpoint: "/user/settings/weightgoal",
  },
  height: {
    label: "Height",
    unit: "cm",
    icon: Ruler,
    type: "number",
    min: 50,
    max: 250,
    fieldName: "height",
    endpoint: "/user/settings/height",
  },
  weight: {
    label: "Weight",
    unit: "kg",
    icon: Weight,
    type: "number",
    min: 20,
    max: 300,
    fieldName: "weight",
    endpoint: "/user/settings/weight",
  },
  calorietarget: {
    label: "Calorie Target",
    unit: "kcal",
    icon: Pizza,
    type: "number",
    min: 1000,
    max: 5000,
    fieldName: "calorieLimit",
    endpoint: "/user/settings/calorietarget",
  },
  sodium: {
    label: "Sodium",
    unit: "mg",
    icon: Hamburger,
    type: "number",
    min: 0,
    max: 10000,
    fieldName: "sodiumLimit",
    endpoint: "/user/settings/sodium",
  },
  protein: {
    label: "Protein",
    unit: "g",
    icon: Beef,
    type: "number",
    min: 0,
    max: 500,
    fieldName: "proteinLimit",
    endpoint: "/user/settings/protein",
  },
  fat: {
    label: "Fat",
    unit: "g",
    icon: Droplet,
    type: "number",
    min: 0,
    max: 300,
    fieldName: "fatLimit",
    endpoint: "/user/settings/fat",
  },
  carbohydrate: {
    label: "Carbohydrate",
    unit: "g",
    icon: Wheat,
    type: "number",
    min: 0,
    max: 1000,
    fieldName: "carbohydrateLimit",
    endpoint: "/user/settings/carbohydrate",
  },
  fiber: {
    label: "Fiber",
    unit: "g",
    icon: Cookie,
    type: "number",
    min: 0,
    max: 200,
    fieldName: "fiberLimit",
    endpoint: "/user/settings/fiber",
  },
  sugar: {
    label: "Sugar",
    unit: "g",
    icon: Apple,
    type: "number",
    min: 0,
    max: 500,
    fieldName: "sugarLimit",
    endpoint: "/user/settings/sugar",
  },
};

export default function UpdateField() {
  const { field } = useParams();
  const cfg = settingsFields[field];
  const { profile } = useContext(UserContext);
  console.log(profile);
  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cfg) return navigate("/settings");

    // Wait until profile is loaded
    if (!profile) return;

    const fieldName = cfg.fieldName || field;
    const val = profile.user[fieldName];

    // Avoid setting value if the profile doesn't have it
    if (val !== undefined) {
      setValue(val);
    }

    setLoading(false);
  }, [cfg, profile, navigate, field]);

  function validate(val) {
    const num = Number(val);
    if (isNaN(num)) return "Must be a number";
    if (num < cfg.min || num > cfg.max)
      return `Must be between ${cfg.min} and ${cfg.max}`;
    return "";
  }

  async function handleSaveClick() {
    const err = validate(value);
    if (err) {
      setError(err);
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000${cfg.endpoint}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ value: Number(value) }),
      });
      if (!res.ok) throw new Error(res.statusText);
      navigate("/settings");
    } catch (e) {
      console.error("Update failed", e);
      setError("Failed to update");
    }
  }

  if (!cfg) return null;
  if (loading) return <div className="p-6">Loading…</div>;

  const Icon = cfg.icon;

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 flex items-center text-white">
        <Icon className="mr-2" /> Update {cfg.label}
      </h1>

      <label className="block mb-2 text-white">
        {cfg.label} ({cfg.unit})
      </label>
      <input
        type={cfg.type}
        step="any"
        min={cfg.min}
        max={cfg.max}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError("");
        }}
        className="w-full p-2 border border-neutral-600 bg-neutral-800 text-white rounded mb-2"
      />
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <button
        onClick={handleSaveClick}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Save
      </button>
    </div>
  );
}
