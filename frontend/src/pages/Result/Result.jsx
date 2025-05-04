// src/pages/Results.jsx
import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.prediction) {
    navigate("/");
    return null;
  }

  const { image, prediction } = state;
  return (
    <div className="p-4 bg-white">
      <button onClick={() => navigate(-1)}>← Try again</button>
      <img src={image} className="my-4 rounded shadow" alt="You provided" />
      <h2 className="text-2xl font-semibold">Prediction</h2>
      <pre className="bg-gray-800 text-white p-4 rounded">
        {JSON.stringify(prediction.predicted_label, null, 2)}
      </pre>
    </div>
  );
}
