import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

// ─── Mood Config ─────────────────────────────────────────────────────────────
const MOODS = [
  {
    id: "dreamy",
    label: "Dreamy",
    emoji: "🌙",
    palette: ["#c9b8f0", "#f0d8f5", "#8b6fcf", "#e8c4e8"],
    bg: "linear-gradient(135deg,#1a0533 0%,#2d1b5e 50%,#4a2080 100%)",
  },
  {
    id: "golden",
    label: "Golden Hour",
    emoji: "🌅",
    palette: ["#f5c842", "#f5935a", "#e8724a", "#fde68a"],
    bg: "linear-gradient(135deg,#3d1c02 0%,#7a3b0e 40%,#c4640a 100%)",
  },
  {
    id: "coastal",
    label: "Coastal",
    emoji: "🌊",
    palette: ["#7dd3fc", "#38bdf8", "#0ea5e9", "#e0f2fe"],
    bg: "linear-gradient(135deg,#012b45 0%,#0c4a6e 50%,#075985 100%)",
  },
  {
    id: "forest",
    label: "Forest",
    emoji: "🌿",
    palette: ["#86efac", "#4ade80", "#16a34a", "#dcfce7"],
    bg: "linear-gradient(135deg,#052e16 0%,#14532d 50%,#166534 100%)",
  },
  {
    id: "chaos",
    label: "Chaotic",
    emoji: "⚡",
    palette: ["#f43f5e", "#fb923c", "#facc15", "#a855f7"],
    bg: "linear-gradient(135deg,#0c0014 0%,#1e003b 40%,#2d0050 100%)",
  },
  {
    id: "minimal",
    label: "Minimal",
    emoji: "🤍",
    palette: ["#e2e8f0", "#cbd5e1", "#94a3b8", "#f8fafc"],
    bg: "linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#334155 100%)",
  },
  {
    id: "romantic",
    label: "Romantic",
    emoji: "🌸",
    palette: ["#fda4af", "#fb7185", "#e11d48", "#ffe4e6"],
    bg: "linear-gradient(135deg,#3b0022 0%,#6b0033 40%,#9f1239 100%)",
  },
  {
    id: "retro",
    label: "Retro",
    emoji: "🦢",
    palette: ["#fcd34d", "#f97316", "#84cc16", "#06b6d4"],
    bg: "linear-gradient(135deg,#1c0a00 0%,#3b1200 50%,#5a1f00 100%)",
  },
];

// ─── Placeholder Image Packs per Mood ────────────────────────────────────────
// Using Unsplash source URLs (no API key required) for real photos
const MOOD_QUERIES = {
  dreamy: [
    "galaxy nebula",
    "moon night",
    "purple clouds",
    "dreamy bokeh",
    "lavender field",
    "mystical forest",
  ],
  golden: [
    "golden hour sunset",
    "warm light photography",
    "desert dunes",
    "autumn leaves",
    "sunrise beach",
    "golden field",
  ],
  coastal: [
    "ocean waves",
    "beach aerial",
    "blue lagoon",
    "sea foam",
    "coastal cliff",
    "tropical reef",
  ],
  forest: [
    "forest sunlight",
    "moss green",
    "fern macro",
    "redwood trees",
    "misty woods",
    "jungle canopy",
  ],
  chaos: [
    "lightning storm",
    "neon city",
    "graffiti art",
    "explosion color",
    "electric lights",
    "urban chaos",
  ],
  minimal: [
    "white marble",
    "minimal architecture",
    "fog mountain",
    "clean texture",
    "empty room",
    "zen stone",
  ],
  romantic: [
    "cherry blossom",
    "rose petals",
    "soft pink light",
    "romantic candle",
    "flower close-up",
    "soft morning",
  ],
  retro: [
    "vintage film",
    "retro diner",
    "old car",
    "cassette tape",
    "80s neon",
    "film grain",
  ],
};

// Unsplash source for real images
const getImageUrl = (query, seed) => {
  const q = encodeURIComponent(query);
  return `https://source.unsplash.com/featured/600x${Math.floor(Math.random() * 300 + 400)}?${q}&sig=${seed}`;
};

// ─── Generate Board Items ─────────────────────────────────────────────────────
const generateItems = (moodId) => {
  const queries = MOOD_QUERIES[moodId] || MOOD_QUERIES.dreamy;
  const items = [];
  const heights = [320, 260, 400, 280, 360, 300, 440, 250, 380, 310, 420, 270];
  for (let i = 0; i < 18; i++) {
    const q = queries[i % queries.length];
    items.push({
      id: `${moodId}-${i}`,
      query: q,
      url: getImageUrl(q, i * 137 + moodId.length * 13),
      height: heights[i % heights.length],
      label: q
        .split(" ")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" "),
      col: i % 3,
    });
  }
  return items;
};

// ─── Components ───────────────────────────────────────────────────────────────

const PinCard = ({ item, mood, index }) => {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const accent = mood.palette[index % mood.palette.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.055,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ marginBottom: "16px", position: "relative", cursor: "pointer" }}
    >
      <motion.div
        animate={{ scale: hovered ? 1.02 : 1, y: hovered ? -4 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          borderRadius: "18px",
          overflow: "hidden",
          position: "relative",
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 2px ${accent}55`
            : "0 4px 24px rgba(0,0,0,0.35)",
          transition: "box-shadow 0.3s ease",
          background: `${accent}22`,
        }}
      >
        {/* Skeleton */}
        {!loaded && (
          <div
            style={{
              height: item.height,
              background: `linear-gradient(135deg, ${accent}22, ${accent}44)`,
              animation: "shimmer 1.5s infinite",
            }}
          />
        )}

        <img
          src={item.url}
          alt={item.label}
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            height: item.height,
            objectFit: "cover",
            display: loaded ? "block" : "none",
          }}
        />

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontFamily: "'DM Sans', sans-serif",
                  color: "#fff",
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                  marginBottom: 6,
                }}
              >
                {item.label}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  style={{
                    background: accent,
                    color: "#000",
                    border: "none",
                    borderRadius: "20px",
                    padding: "5px 14px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Save
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "20px",
                    padding: "5px 14px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Share
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Accent dot */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 12px ${accent}`,
            opacity: loaded ? 1 : 0,
          }}
        />
      </motion.div>
    </motion.div>
  );
};

// Masonry layout: split items into 3 columns
const MasonryGrid = ({ items, mood }) => {
  const cols = [[], [], []];
  items.forEach((item, i) => cols[i % 3].push({ ...item, origIndex: i }));

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        padding: "0 24px 60px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      {cols.map((col, ci) => (
        <div key={ci} style={{ display: "flex", flexDirection: "column" }}>
          {col.map((item) => (
            <PinCard
              key={item.id}
              item={item}
              mood={mood}
              index={item.origIndex}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ─── Mood Selector ────────────────────────────────────────────────────────────
const MoodPill = ({ mood, selected, onSelect }) => (
  <motion.button
    onClick={() => onSelect(mood)}
    whileHover={{ scale: 1.06, y: -2 }}
    whileTap={{ scale: 0.95 }}
    animate={{
      background: selected
        ? `linear-gradient(135deg, ${mood.palette[0]}, ${mood.palette[2]})`
        : "rgba(255,255,255,0.07)",
      borderColor: selected ? mood.palette[0] : "rgba(255,255,255,0.12)",
      color: selected ? "#000" : "#ddd",
      boxShadow: selected ? `0 0 24px ${mood.palette[0]}66` : "none",
    }}
    transition={{ duration: 0.25 }}
    style={{
      border: "1px solid",
      borderRadius: "32px",
      padding: "10px 22px",
      fontSize: "14px",
      fontWeight: 700,
      cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
      letterSpacing: "0.01em",
      display: "flex",
      alignItems: "center",
      gap: 7,
      whiteSpace: "nowrap",
    }}
  >
    <span style={{ fontSize: 18 }}>{mood.emoji}</span>
    {mood.label}
  </motion.button>
);

// ─── Floating Orbs BG ─────────────────────────────────────────────────────────
const FloatingOrbs = ({ mood }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      pointerEvents: "none",
      zIndex: 0,
      overflow: "hidden",
    }}
  >
    {mood.palette.map((color, i) => (
      <motion.div
        key={i}
        animate={{
          x: [0, 40 * (i % 2 === 0 ? 1 : -1), 0],
          y: [0, 30 * (i % 3 === 0 ? 1 : -1), 0],
        }}
        transition={{
          duration: 8 + i * 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          width: 300 + i * 80,
          height: 300 + i * 80,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
          top: `${10 + i * 22}%`,
          left: `${-10 + i * 28}%`,
          filter: "blur(40px)",
        }}
      />
    ))}
  </div>
);

// ─── Header ───────────────────────────────────────────────────────────────────
const Header = ({ mood }) => {
  const { scrollY } = useScroll();
  const blur = useTransform(scrollY, [0, 100], [0, 16]);
  const bg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(0,0,0,0)", "rgba(0,0,0,0.6)"],
  );

  return (
    <motion.header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: `blur(${blur}px)`,
        background: bg,
        padding: "16px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.3s",
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ display: "flex", alignItems: "center", gap: 10 }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: "10px",
            background: `linear-gradient(135deg, ${mood.palette[0]}, ${mood.palette[2]})`,
            boxShadow: `0 0 20px ${mood.palette[0]}88`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 17,
          }}
        >
          {mood.emoji}
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "20px",
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            moodboard
          </div>
          <div
            style={{
              fontSize: "11px",
              color: mood.palette[0],
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {mood.label} vibes
          </div>
        </div>
      </motion.div>
      <motion.div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: `linear-gradient(135deg, ${mood.palette[0]}, ${mood.palette[2]})`,
            color: "#000",
            border: "none",
            borderRadius: "20px",
            padding: "8px 20px",
            fontSize: "13px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: `0 4px 16px ${mood.palette[0]}55`,
          }}
        >
          Export Board
        </motion.button>
      </motion.div>
    </motion.header>
  );
};

// ─── Mood Prompt Input ────────────────────────────────────────────────────────
const MoodPrompt = ({ onMoodText }) => {
  const [val, setVal] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!val.trim() || loading) return;
    setLoading(true);
    await onMoodText(val.trim());
    setLoading(false);
    setVal("");
  };

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        marginTop: 12,
        width: "100%",
        maxWidth: 520,
      }}
    >
      <input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Describe your vibe… e.g. 'cozy rainy sunday'"
        style={{
          flex: 1,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "14px",
          padding: "12px 18px",
          color: "#fff",
          fontSize: "14px",
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
        }}
      />
      <motion.button
        onClick={submit}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: "14px",
          padding: "12px 20px",
          color: "#fff",
          fontSize: "14px",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          cursor: loading ? "wait" : "pointer",
        }}
      >
        {loading ? "✨" : "Go"}
      </motion.button>
    </div>
  );
};

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const boardRef = useRef(null);

  const loadMood = useCallback((mood) => {
    setLoading(true);
    setItems([]);
    setTimeout(() => {
      setItems(generateItems(mood.id));
      setLoading(false);
    }, 400);
  }, []);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    loadMood(mood);
    setAiStatus("");
  };

  // Use Claude API to pick a mood from free text
  const handleMoodText = async (text) => {
    setAiStatus("reading vibes…");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 100,
          messages: [
            {
              role: "user",
              content: `Given this mood description: "${text}"
Pick EXACTLY ONE mood from this list that best matches it: dreamy, golden, coastal, forest, chaos, minimal, romantic, retro.
Reply with ONLY the single word mood id, nothing else.`,
            },
          ],
        }),
      });
      const data = await res.json();
      const moodId = data.content?.[0]?.text
        ?.trim()
        .toLowerCase()
        .replace(/[^a-z]/g, "");
      const matched = MOODS.find((m) => m.id === moodId) || MOODS[0];
      setAiStatus(`✦ Matched to "${matched.label}" ${matched.emoji}`);
      setSelectedMood(matched);
      loadMood(matched);
    } catch {
      setAiStatus("Couldn't read vibes, try a mood button!");
    }
  };

  useEffect(() => {
    loadMood(MOODS[0]);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0f; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
        @keyframes shimmer {
          0% { opacity: 0.4; }
          50% { opacity: 0.8; }
          100% { opacity: 0.4; }
        }
        input::placeholder { color: rgba(255,255,255,0.35); }
      `}</style>

      {/* Animated background */}
      <motion.div
        key={selectedMood.id + "-bg"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: selectedMood.bg,
        }}
      />
      <FloatingOrbs mood={selectedMood} />
      <Header mood={selectedMood} />

      <div
        ref={boardRef}
        style={{
          paddingTop: 90,
          minHeight: "100vh",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Hero section */}
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px 36px",
          }}
        >
          <motion.div
            key={selectedMood.id + "-title"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              style={{
                fontSize: "11px",
                color: selectedMood.palette[0],
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              ✦ Curated for your mood ✦
            </div>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(42px, 6vw, 72px)",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                marginBottom: 8,
              }}
            >
              {selectedMood.label}
              <span style={{ color: selectedMood.palette[0] }}> Board</span>
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "16px",
                maxWidth: 400,
                margin: "0 auto 28px",
                lineHeight: 1.6,
              }}
            >
              A visual world crafted around your feeling. Scroll, explore, get
              lost.
            </p>
          </motion.div>

          {/* Mood Pills */}
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            {MOODS.map((mood) => (
              <MoodPill
                key={mood.id}
                mood={mood}
                selected={selectedMood.id === mood.id}
                onSelect={handleMoodSelect}
              />
            ))}
          </div>

          {/* AI Text Input */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <MoodPrompt onMoodText={handleMoodText} />
            <AnimatePresence>
              {aiStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    marginTop: 10,
                    fontSize: "13px",
                    color: selectedMood.palette[0],
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {aiStatus}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${selectedMood.palette[0]}44, transparent)`,
            margin: "0 40px 32px",
          }}
        />

        {/* Board */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
                gap: 12,
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: selectedMood.palette[i],
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={selectedMood.id + "-board"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <MasonryGrid items={items} mood={selectedMood} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            padding: "24px",
            color: "rgba(255,255,255,0.25)",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            letterSpacing: "0.05em",
          }}
        >
          moodboard · powered by AI & Unsplash · your vibe, visualized
        </div>
      </div>
    </>
  );
}
