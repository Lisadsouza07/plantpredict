import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FONT = "'Cormorant Garamond', serif";

// Two layers of leaves — front layer (larger, faster) and back layer (smaller, slower)
const LEAVES_BACK = [
  { id: "b1", emoji: "🌿", x: "8%",  delay: 0,   duration: 18, size: "2.2rem", opacity: 0.3 },
  { id: "b2", emoji: "🍃", x: "30%", delay: 3,   duration: 22, size: "2rem",   opacity: 0.25 },
  { id: "b3", emoji: "🍀", x: "55%", delay: 1,   duration: 20, size: "1.8rem", opacity: 0.28 },
  { id: "b4", emoji: "🌿", x: "75%", delay: 5,   duration: 19, size: "2.4rem", opacity: 0.3 },
  { id: "b5", emoji: "🪴", x: "88%", delay: 2,   duration: 21, size: "1.9rem", opacity: 0.25 },
];

const LEAVES_FRONT = [
  { id: "f1", emoji: "🌿", x: "4%",  delay: 0,   duration: 12, size: "3rem",   opacity: 0.55 },
  { id: "f2", emoji: "🪴", x: "18%", delay: 2,   duration: 14, size: "2.8rem", opacity: 0.5  },
  { id: "f3", emoji: "🌱", x: "78%", delay: 1,   duration: 11, size: "2.5rem", opacity: 0.5  },
  { id: "f4", emoji: "🍀", x: "92%", delay: 3,   duration: 13, size: "3.2rem", opacity: 0.55 },
  { id: "f5", emoji: "🌿", x: "50%", delay: 4,   duration: 15, size: "2.6rem", opacity: 0.5  },
  { id: "f6", emoji: "🪴", x: "64%", delay: 0.5, duration: 10, size: "2.8rem", opacity: 0.45 },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  body, input, button, p, span, div, h1, h2, h3 {
    font-family: 'Cormorant Garamond', serif;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .analyze-btn {
    width: 100%;
    margin-top: 1rem;
    padding: 11px;
    background: #2d6a4f;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 18px;
    font-weight: 500;
    font-family: 'Cormorant Garamond', serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: background 0.15s;
    letter-spacing: 0.02em;
  }
  .analyze-btn:hover:not(:disabled) { background: #1b4332; }
  .analyze-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  .drop-zone {
    border: 1.5px dashed #b7d8c6;
    border-radius: 10px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: background 0.15s;
    position: relative;
  }
  .drop-zone:hover, .drop-zone.dragover { background: #f0f9f4; }

  .bar-fill {
    height: 100%;
    border-radius: 99px;
  }
`;

function LeafLayer({ leaves, zIndex }) {
  return (
    <>
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          style={{
            position: "absolute",
            left: leaf.x,
            top: "-60px",
            opacity: leaf.opacity,
            fontSize: leaf.size,
            pointerEvents: "none",
            zIndex,
            filter: zIndex === 1 ? "blur(1.5px)" : "none",
          }}
          animate={{
            y: ["0vh", "110vh"],
            rotate: [0, 360],
            x: [0, 20, -14, 8, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            repeatDelay: leaf.delay + 2,
            ease: "linear",
          }}
        >
          {leaf.emoji}
        </motion.div>
      ))}
    </>
  );
}

function RankBadge({ rank, delay }) {
  const colors = {
    1: { bg: "#f8d96e", color: "#5c4200", shadow: "rgba(248,217,110,0.6)" },
    2: { bg: "#d0d7df", color: "#2c3540", shadow: "rgba(208,215,223,0.6)" },
    3: { bg: "#e8b87a", color: "#5c3300", shadow: "rgba(232,184,122,0.6)" },
  };
  const c = colors[rank] || colors[3];
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{
        delay,
        duration: 0.5,
        type: "spring",
        stiffness: 260,
        damping: 16,
      }}
      style={{
        width: 26, height: 26, borderRadius: "50%",
        background: c.bg, color: c.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 600, flexShrink: 0,
        fontFamily: FONT,
        boxShadow: `0 0 0 3px ${c.shadow}`,
      }}
    >
      {rank}
    </motion.div>
  );
}

function ResultCard({ pred, index }) {
  const pct = (pred.confidence * 100).toFixed(1);
  const isHealthy = pred.prediction.toLowerCase().includes("healthy");
  const name = pred.prediction.replace(/_/g, " ");
  const cardDelay = index * 0.14;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: cardDelay, ease: "easeOut" }}
      style={{
        background: "#f6faf7",
        borderRadius: 10,
        padding: "12px 14px",
        border: "0.5px solid #d4eadb",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <RankBadge rank={index + 1} delay={cardDelay + 0.1} />
        <span style={{ fontSize: 17, fontWeight: 500, flex: 1, color: "#1a2e1a", fontFamily: FONT }}>
          {name}
        </span>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: cardDelay + 0.25, duration: 0.3 }}
          style={{
            fontSize: 13, padding: "2px 10px", borderRadius: 99, fontWeight: 500,
            fontFamily: FONT,
            background: isHealthy ? "#eaf3de" : "#fcebeb",
            color: isHealthy ? "#3b6d11" : "#a32d2d",
          }}
        >
          {isHealthy ? "Healthy" : "Disease"}
        </motion.span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          flex: 1, height: 4, background: "#ddeae0",
          borderRadius: 99, overflow: "hidden",
        }}>
          <motion.div
            className="bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, delay: cardDelay + 0.3, ease: "easeOut" }}
            style={{ background: isHealthy ? "#52b788" : "#e24b4a" }}
          />
        </div>
        <span style={{ fontSize: 14, color: "#4a6a52", minWidth: 40, textAlign: "right", fontFamily: FONT }}>
          {pct}%
        </span>
      </div>
    </motion.div>
  );
}

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) return;
    setFile(selectedFile);
    setPredictions(null);
    setError(null);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  const clearImage = () => {
    setFile(null);
    setPreview(null);
    setPredictions(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setPredictions(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();

      const preds =
        data.predictions ??
        (data.prediction
          ? [{ prediction: data.prediction, confidence: data.confidence }]
          : null);

      if (!preds || !preds.length) throw new Error("Unexpected response format from server.");
      setPredictions(preds.slice(0, 3));
    } catch (err) {
      setError(
        err.message.includes("fetch")
          ? "Could not reach the prediction server. Make sure it's running at localhost:8000."
          : err.message
      );
    }

    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #e8f5e8 0%, #d4edda 40%, #b8dfc4 100%)",
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT,
      }}>

        {/* Back leaf layer — blurred, slower, lighter */}
        <LeafLayer leaves={LEAVES_BACK} zIndex={1} />

        {/* Front leaf layer — sharp, faster, darker */}
        <LeafLayer leaves={LEAVES_FRONT} zIndex={2} />

        <div style={{
          position: "relative", zIndex: 10,
          minHeight: "100vh", display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "4rem 1rem",
        }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ textAlign: "center", marginBottom: "2.5rem" }}
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 56, height: 56, borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1rem", fontSize: 26,
              }}
            >
            </motion.div>
            <h1 style={{ fontSize: "2.8rem", fontWeight: 500, color: "#1a2e1a", fontFamily: FONT, margin: 0 }}>
              Plant Disease Detector 🌱
            </h1>
            <p style={{ fontSize: 18, color: "#4a6a52", marginTop: 6, fontFamily: FONT }}>
              Is your plant healthy? Upload an image to find out!
            </p>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            style={{
              background: "white",
              border: "0.5px solid #d4eadb",
              borderRadius: 16,
              padding: "1.5rem",
              width: "100%",
              maxWidth: 440,
              boxShadow: "0 2px 24px rgba(45,106,79,0.06)",
            }}
          >
            {/* Drop zone */}
            <div
              className={`drop-zone${dragging ? " dragover" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => { if (e.target.files?.[0]) handleFileChange(e.target.files[0]); }}
              />
              <div style={{ fontSize: 28, marginBottom: 8 }}>📤</div>
              <p style={{ fontSize: 17, color: "#4a6a52", fontFamily: FONT }}>
                Drop a photo here or click to browse
              </p>
              <p style={{ fontSize: 14, color: "#8aab90", marginTop: 4, fontFamily: FONT }}>
                JPG · PNG · WEBP
              </p>
            </div>

            {/* Preview */}
            <AnimatePresence>
              {preview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}
                  style={{ position: "relative", marginTop: "1rem" }}
                >
                  <img
                    src={preview}
                    alt="Selected plant"
                    style={{
                      width: "100%", borderRadius: 10,
                      maxHeight: 200, objectFit: "cover", display: "block",
                    }}
                  />
                  <button
                    onClick={clearImage}
                    style={{
                      position: "absolute", top: 6, right: 6,
                      background: "rgba(0,0,0,0.55)", border: "none",
                      borderRadius: "50%", width: 26, height: 26,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: "white", fontSize: 14,
                    }}
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Analyze button */}
            <button
              className="analyze-btn"
              onClick={handleUpload}
              disabled={!file || loading}
            >
              {loading
                ? <><div className="spinner" /> Analysing…</>
                : <>🔬 Analyse plant</>
              }
            </button>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: "#fcebeb", border: "0.5px solid #f09595",
                    borderRadius: 8, padding: "10px 14px", marginTop: "1rem",
                    fontSize: 16, color: "#a32d2d", display: "flex", gap: 8,
                    fontFamily: FONT,
                  }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {predictions && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ marginTop: "1.25rem" }}
                >
                  <hr style={{ border: "none", borderTop: "0.5px solid #d4eadb", marginBottom: "1rem" }} />
                  <p style={{ fontSize: 13, color: "#8aab90", marginBottom: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: FONT }}>
                    Top {predictions.length} predictions
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {predictions.map((pred, i) => (
                      <ResultCard key={i} pred={pred} index={i} />
                    ))}
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    style={{ fontSize: 13, color: "#8aab90", textAlign: "center", marginTop: "1rem", fontFamily: FONT }}
                  >
                    Backend required at localhost:8000
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        </div>
      </div>
    </>
  );
}