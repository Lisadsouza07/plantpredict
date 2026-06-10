import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Leaf, AlertTriangle, CheckCircle2, X, Sprout } from "lucide-react";



const FLOATING_LEAVES = [
  { id: 1, emoji: "🌿", x: "4%", delay: 0, duration: 12 },
  { id: 2, emoji: "🍃", x: "18%", delay: 2, duration: 14 },
  { id: 3, emoji: "🌱", x: "78%", delay: 1, duration: 11 },
  { id: 4, emoji: "🍀", x: "92%", delay: 3, duration: 13 },
  { id: 5, emoji: "🌿", x: "50%", delay: 4, duration: 15 },
  { id: 6, emoji: "🍃", x: "64%", delay: 0.5, duration: 10 },
];

export default function App() {
const [file, setFile] = useState(null);
const [preview, setPreview] = useState(null);
const [result, setResult] = useState(null);
const [error, setError] = useState(null);
const [loading, setLoading] = useState(false);
const [dragging, setDragging] = useState(false);
const inputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleInputChange = (e) => {
    if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("image/")) handleFileChange(dropped);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      setResult(data);
    } catch {
      setError("Could not reach the prediction server. Make sure it's running at localhost:8000.");
    }
    setLoading(false);
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const isHealthy = result?.prediction?.toLowerCase().includes("healthy");
  const confidencePct = result ? (result.confidence * 100).toFixed(1) : "0";

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #ffffff 0%, #f0f9f0 40%, #e8f5e8 100%)" }}
    >
      {/* Subtle green radial accent top-right */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 85% 10%, rgba(82,183,136,0.12) 0%, transparent 65%), radial-gradient(ellipse 40% 35% at 10% 90%, rgba(45,106,79,0.08) 0%, transparent 60%)",
        }}
      />

      {/* Floating leaves — very soft */}
      {FLOATING_LEAVES.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute pointer-events-none select-none text-xl"
          style={{ left: leaf.x, top: "-40px", opacity: 0.12 }}
          animate={{ y: ["0vh", "110vh"], rotate: [0, 360], x: [0, 20, -15, 8, 0] }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            repeatDelay: leaf.delay + 3,
            ease: "linear",
          }}
        >
          {leaf.emoji}
        </motion.div>
      ))}

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          {/* Leaf icon mark */}
          <motion.div
            className="flex justify-center mb-4"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #2d6a4f, #52b788)" }}
            >
              <Leaf size={28} color="white" />
            </div>
          </motion.div>

          <h1
            className="text-[#1a2e1a]"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.8rem",
              fontWeight: 500,
              letterSpacing: "0.04em",
              lineHeight: 1.1,
            }}
          >
            Plant Disease Detector
          </h1>
          <p
            className="mt-2"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
              color: "#5a8a6a",
              fontWeight: 300,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Give your plant a quick health check 🌱
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full max-w-md"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(45,106,79,0.12)",
            borderRadius: "24px",
            boxShadow: "0 4px 40px rgba(45,106,79,0.08), 0 1px 4px rgba(45,106,79,0.06)",
          }}
        >
          <div className="p-7">
            {/* Drop zone */}
            <motion.div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => !preview && inputRef.current?.click()}
              animate={dragging ? { scale: 1.015 } : { scale: 1 }}
              transition={{ duration: 0.15 }}
              className="relative rounded-2xl cursor-pointer overflow-hidden"
              style={{
                border: `1.5px dashed ${dragging ? "#2d6a4f" : preview ? "rgba(45,106,79,0.25)" : "rgba(45,106,79,0.2)"}`,
                background: dragging ? "rgba(82,183,136,0.05)" : "rgba(238,246,238,0.5)",
                minHeight: preview ? "auto" : "190px",
                transition: "border-color 0.2s, background 0.2s",
              }}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />

              <AnimatePresence mode="wait">
                {preview ? (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative"
                  >
                    <img
                      src={preview}
                      alt="Uploaded plant"
                      className="w-full rounded-xl object-cover max-h-60"
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); clearImage(); }}
                      className="absolute top-2 right-2 rounded-full p-1.5 transition-colors"
                      style={{
                        background: "rgba(255,255,255,0.92)",
                        border: "1px solid rgba(45,106,79,0.2)",
                        boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
                      }}
                    >
                      <X size={14} style={{ color: "#2d6a4f" }} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-3 py-12 px-4"
                  >
                    <motion.div
                      animate={dragging ? { scale: 1.15, rotate: 8 } : { scale: 1, rotate: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Upload size={36} style={{ color: "#52b788", opacity: 0.8 }} />
                    </motion.div>
                    <div className="text-center">
                      <p
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: "#1a2e1a",
                          fontWeight: 400,
                          fontSize: "0.95rem",
                        }}
                      >
                        {dragging ? "Release to upload" : "Drag & drop a leaf photo"}
                      </p>
                      <p
                        className="mt-1"
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          color: "#5a8a6a",
                          fontSize: "0.8rem",
                          fontWeight: 300,
                        }}
                      >
                        or click to browse
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: "rgba(45,106,79,0.1)" }} />
              <span
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.7rem",
                  color: "#5a8a6a",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 400,
                }}
              >
                Analysis
              </span>
              <div className="flex-1 h-px" style={{ background: "rgba(45,106,79,0.1)" }} />
            </div>

            {/* Analyze button */}
            <motion.button
              onClick={handleUpload}
              disabled={!file || loading}
              whileTap={file && !loading ? { scale: 0.98 } : {}}
              whileHover={file && !loading ? { scale: 1.015 } : {}}
              className="w-full py-3.5 rounded-xl flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: file && !loading
                  ? "linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)"
                  : "rgba(45,106,79,0.08)",
                color: file && !loading ? "#ffffff" : "#5a8a6a",
                border: "none",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                boxShadow: file && !loading ? "0 4px 20px rgba(45,106,79,0.25)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  >
                    <Sprout size={17} />
                  </motion.div>
                  Analyzing…
                </>
              ) : (
                <>
                  <Leaf size={17} />
                  Diagnose Plant
                </>
              )}
            </motion.button>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="rounded-xl px-4 py-3 flex items-start gap-2.5"
                  style={{ background: "rgba(192,57,43,0.06)", border: "1px solid rgba(192,57,43,0.2)" }}
                >
                  <AlertTriangle size={16} style={{ color: "#c0392b", marginTop: 2, flexShrink: 0 }} />
                  <p
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      color: "#c0392b",
                      fontSize: "0.82rem",
                      fontWeight: 300,
                    }}
                  >
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Result */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="mt-5 rounded-2xl p-5"
                  style={{
                    background: isHealthy
                      ? "linear-gradient(135deg, rgba(82,183,136,0.08), rgba(45,106,79,0.04))"
                      : "linear-gradient(135deg, rgba(192,57,43,0.07), rgba(192,57,43,0.03))",
                    border: `1px solid ${isHealthy ? "rgba(45,106,79,0.18)" : "rgba(192,57,43,0.18)"}`,
                  }}
                >
                  {/* Status */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.15, type: "spring", stiffness: 280 }}
                    >
                      {isHealthy ? (
                        <CheckCircle2 size={20} style={{ color: "#2d6a4f" }} />
                      ) : (
                        <AlertTriangle size={20} style={{ color: "#c0392b" }} />
                      )}
                    </motion.div>
                    <span
                      className="px-3 py-0.5 rounded-full"
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.72rem",
                        fontWeight: 500,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        background: isHealthy ? "rgba(45,106,79,0.1)" : "rgba(192,57,43,0.1)",
                        color: isHealthy ? "#2d6a4f" : "#c0392b",
                      }}
                    >
                      {isHealthy ? "Healthy" : "Disease Detected"}
                    </span>
                  </div>

                  {/* Prediction name */}
                  <p
                    className="mb-4"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.25rem",
                      fontWeight: 500,
                      color: "#1a2e1a",
                      fontStyle: "italic",
                      lineHeight: 1.3,
                    }}
                  >
                    {result.prediction}
                  </p>

                  {/* Confidence bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.72rem",
                          color: "#5a8a6a",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          fontWeight: 400,
                        }}
                      >
                        Confidence
                      </span>
                      <span
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "1.05rem",
                          fontWeight: 600,
                          color: isHealthy ? "#2d6a4f" : "#c0392b",
                        }}
                      >
                        {confidencePct}%
                      </span>
                    </div>
                    <div
                      className="w-full rounded-full overflow-hidden"
                      style={{ height: "3px", background: "rgba(45,106,79,0.1)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${confidencePct}%` }}
                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                        style={{
                          background: isHealthy
                            ? "linear-gradient(90deg, #2d6a4f, #52b788)"
                            : "linear-gradient(90deg, #c0392b, #e74c3c)",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.72rem",
            color: "#5a8a6a",
            opacity: 0.5,
            letterSpacing: "0.06em",
          }}
        >
          JPG · PNG · WEBP &nbsp;·&nbsp; Backend required at localhost:8000
        </motion.p>
      </div>
    </div>
  );
}
