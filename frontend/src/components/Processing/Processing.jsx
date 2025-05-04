// src/pages/Processing.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import Spinner from "../components/Spinner";

export default function Processing() {
  // 1) Hooks first, always
  const { state } = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  // 2) Redirect effect: if you have no image, send them home
  useEffect(() => {
    if (!state?.image) {
      navigate("/home", { replace: true });
    }
  }, [state, navigate]);

  useEffect(() => {
    if (!state?.image) {
      return navigate("/");
    }

    const MIN_DELAY = 2000; // minimum display time (ms)
    const startTime = Date.now(); // record when we began

    (async () => {
      try {
        const blob = await (await fetch(state.image)).blob();
        const fd = new FormData();
        fd.append("file", blob, "upload.jpg");

        const res = await fetch("http://127.0.0.1:5000/predict", {
          method: "POST",
          body: fd,
        });
        if (!res.ok) throw new Error(res.statusText);
        const prediction = await res.json();

        // figure out how much longer to wait
        const elapsed = Date.now() - startTime;
        if (elapsed < MIN_DELAY) {
          await new Promise((r) => setTimeout(r, MIN_DELAY - elapsed));
        }

        // finally navigate
        navigate("/results", {
          state: { image: state.image, prediction },
        });
      } catch (err) {
        console.error(err);
        setError("Oops! Something went wrong.");
      }
    })();
  }, [state, navigate]);

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <p className="text-red-500">{error}</p>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      Loading
      <p className="mt-4 text-white">Analyzing your photo…</p>
    </div>
  );
}
