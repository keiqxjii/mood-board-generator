import { motion } from 'framer-motion'

export default function FloatingOrbs({ mood }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {mood.palette.map((color, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, 40 * (i % 2 === 0 ? 1 : -1), 0],
            y: [0, 30 * (i % 3 === 0 ? 1 : -1), 0],
          }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: 300 + i * 80,
            height: 300 + i * 80,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
            top: `${10 + i * 22}%`,
            left: `${-10 + i * 28}%`,
            filter: 'blur(40px)',
          }}
        />
      ))}
    </div>
  )
}
