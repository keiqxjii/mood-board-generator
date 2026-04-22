import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PinCard({ item, mood, index }) {
  const [loaded, setLoaded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const accent = mood.palette[index % mood.palette.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.055, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ marginBottom: 16, position: 'relative', cursor: 'pointer' }}
    >
      <motion.div
        animate={{ scale: hovered ? 1.02 : 1, y: hovered ? -4 : 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          borderRadius: 18,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: hovered
            ? `0 20px 60px rgba(0,0,0,0.5), 0 0 0 2px ${accent}55`
            : '0 4px 24px rgba(0,0,0,0.35)',
          transition: 'box-shadow 0.3s ease',
          background: `${accent}22`,
        }}
      >
        {/* Skeleton shimmer */}
        {!loaded && (
          <div
            style={{
              height: item.height,
              background: `linear-gradient(135deg, ${accent}22, ${accent}44)`,
              animation: 'shimmer 1.5s infinite',
            }}
          />
        )}

        <img
          src={item.url}
          alt={item.label}
          onLoad={() => setLoaded(true)}
          style={{
            width: '100%',
            height: item.height,
            objectFit: 'cover',
            display: loaded ? 'block' : 'none',
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
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: 16,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "'DM Sans', sans-serif",
                  color: '#fff',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                  marginBottom: 6,
                }}
              >
                {item.label}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  style={{
                    background: accent,
                    color: '#000',
                    border: 'none',
                    borderRadius: 20,
                    padding: '5px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Save
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: 20,
                    padding: '5px 14px',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
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
        {loaded && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: accent,
              boxShadow: `0 0 12px ${accent}`,
            }}
          />
        )}
      </motion.div>
    </motion.div>
  )
}
