import { motion } from "framer-motion";

export default function MoodPill({ mood, selected, onSelect }) {
  return (
    <motion.button
      onClick={() => onSelect(mood)}
      whileHover={{ scale: 1.06, y: -2 }}
      whileTap={{ scale: 0.95 }}
      style={{
        border: `1px solid ${selected ? mood.palette[0] : "rgba(255,255,255,0.12)"}`,
        borderRadius: 32,
        padding: "10px 22px",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.01em",
        display: "flex",
        alignItems: "center",
        gap: 7,
        whiteSpace: "nowrap",
        background: selected
          ? `linear-gradient(135deg, ${mood.palette[0]}, ${mood.palette[2]})`
          : "rgba(255,255,255,0.07)",
        color: selected ? "#000" : "#ddd",
        boxShadow: selected ? `0 0 24px ${mood.palette[0]}66` : "none",
        transition: "all 0.25s ease",
      }}
    >
      <span style={{ fontSize: 18 }}>{mood.emoji}</span>
      {mood.label}
    </motion.button>
  );
}
