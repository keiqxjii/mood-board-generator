import { motion, useScroll, useTransform } from 'framer-motion'

export default function Header({ mood }) {
  const { scrollY } = useScroll()
  const blur = useTransform(scrollY, [0, 100], [0, 16])
  const bg = useTransform(scrollY, [0, 80], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.6)'])

  return (
    <motion.header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backdropFilter: `blur(${blur}px)`,
        background: bg,
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ display: 'flex', alignItems: 'center', gap: 10 }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${mood.palette[0]}, ${mood.palette[2]})`,
            boxShadow: `0 0 20px ${mood.palette[0]}88`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 17,
          }}
        >
          {mood.emoji}
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
          >
            moodboard
          </div>
          <div
            style={{
              fontSize: 11,
              color: mood.palette[0],
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {mood.label} vibes
          </div>
        </div>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: `linear-gradient(135deg, ${mood.palette[0]}, ${mood.palette[2]})`,
          color: '#000',
          border: 'none',
          borderRadius: 20,
          padding: '8px 20px',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          boxShadow: `0 4px 16px ${mood.palette[0]}55`,
        }}
      >
        Export Board
      </motion.button>
    </motion.header>
  )
}
