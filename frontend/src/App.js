import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);

    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    setResult(data);
    setLoading(false);
  };

  const isHealthy =
    result?.prediction?.toLowerCase().includes("healthy");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-green-600 p-6">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 text-center text-white">

        <h1 className="text-2xl font-bold mb-4">
          🌿 Plant Disease Detector
        </h1>

        <input type="file" onChange={handleFileChange} />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-full mt-4 rounded-xl border border-white/20 shadow-lg"
          />
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-4 w-full bg-green-400 hover:bg-green-300 text-black font-semibold py-2 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Predict"}
        </button>

        {result && (
          <div className="mt-6 p-4 rounded-xl bg-white/10 border border-white/20">

            {/* Badge */}
            <div className="mb-2">
              <span
                className={`px-3 py-1 text-xs rounded-full font-semibold ${
                  isHealthy
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {isHealthy ? "Healthy" : "Diseased"}
              </span>
            </div>

            {/* Prediction */}
            <div className="text-lg font-semibold">
              {result.prediction}
            </div>

            {/* Confidence */}
            <div className="mt-2 text-sm">
              Confidence: {(result.confidence * 100).toFixed(2)}%
            </div>

            {/* Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
              <div
                className="bg-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;