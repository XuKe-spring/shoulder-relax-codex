import { motion } from 'framer-motion'
import type { AnimationKey } from '../../types'

interface ExerciseAnimationProps {
  type: AnimationKey
  title: string
}

const motionFor = (type: AnimationKey) => {
  switch (type) {
    case 'neckSideStretch':
      return { headX: [-6, 10, -6], headRotate: [-10, 12, -10], armY: [0, 0, 0] }
    case 'neckTurn':
      return { headX: [-8, 8, -8], headRotate: [-4, 4, -4], armY: [0, 0, 0] }
    case 'chestOpen':
    case 'scapulaSqueeze':
      return { headX: [0, 0, 0], headRotate: [0, 0, 0], armY: [16, -6, 16] }
    case 'chinTuck':
      return { headX: [10, -8, 10], headRotate: [0, 0, 0], armY: [0, 0, 0] }
    case 'armRaise':
    case 'fullBodyReach':
      return { headX: [0, 0, 0], headRotate: [0, 0, 0], armY: [18, -28, 18] }
    case 'sideStretch':
      return { headX: [-10, 12, -10], headRotate: [-6, 8, -6], armY: [4, -20, 4] }
    case 'neckCircle':
      return { headX: [-8, 8, 8, -8], headRotate: [-8, 8, -8, 8], armY: [0, 0, 0, 0] }
    case 'thoracicRotate':
      return { headX: [-10, 10, -10], headRotate: [-8, 8, -8], armY: [0, -6, 0] }
    default:
      return { headX: [0, 0, 0], headRotate: [0, 0, 0], armY: [0, 0, 0] }
  }
}

const transition = { duration: 3, repeat: Infinity, ease: 'easeInOut' as const }
const shoulderTransition = { duration: 2.2, repeat: Infinity, ease: 'easeInOut' as const }

const ShoulderShrugCue = () => (
  <>
    <motion.g animate={{ y: [18, -18, 18] }} transition={shoulderTransition}>
      <line x1="122" y1="172" x2="122" y2="130" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
      <path d="M108 140 L122 124 L136 140" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="238" y1="172" x2="238" y2="130" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
      <path d="M224 140 L238 124 L252 140" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
    <text x="180" y="326" textAnchor="middle" fill="#fef3c7" fontSize="20" fontWeight="800">肩膀垂直上提，再放松落下</text>
  </>
)

const ShoulderRollCue = () => (
  <>
    <ellipse cx="122" cy="158" rx="34" ry="46" fill="none" stroke="#facc15" strokeDasharray="8 8" strokeWidth="5" />
    <ellipse cx="238" cy="158" rx="34" ry="46" fill="none" stroke="#facc15" strokeDasharray="8 8" strokeWidth="5" />
    <path d="M98 132 C118 102 152 118 146 152" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
    <path d="M146 152 L132 142 L150 134" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M262 132 C242 102 208 118 214 152" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
    <path d="M214 152 L228 142 L210 134" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    <motion.circle cx="122" cy="112" r="8" fill="#fde68a" animate={{ cx: [122, 152, 122, 92, 122], cy: [112, 158, 204, 158, 112] }} transition={transition} />
    <motion.circle cx="238" cy="112" r="8" fill="#fde68a" animate={{ cx: [238, 268, 238, 208, 238], cy: [112, 158, 204, 158, 112] }} transition={transition} />
    <text x="180" y="326" textAnchor="middle" fill="#fef3c7" fontSize="20" fontWeight="800">肩头向上、向后、向下画圆</text>
  </>
)

const Arms = ({ type, armY }: { type: AnimationKey; armY: number[] }) => {
  if (type === 'shoulderShrug') {
    return (
      <motion.g animate={{ y: [14, -20, 14] }} transition={shoulderTransition}>
        <line x1="124" y1="160" x2="236" y2="160" stroke="url(#bodyLine)" strokeWidth="11" strokeLinecap="round" />
        <line x1="124" y1="160" x2="104" y2="238" stroke="url(#bodyLine)" strokeWidth="9" strokeLinecap="round" />
        <line x1="236" y1="160" x2="256" y2="238" stroke="url(#bodyLine)" strokeWidth="9" strokeLinecap="round" />
        <circle cx="124" cy="160" r="11" fill="#4dd4ac" />
        <circle cx="236" cy="160" r="11" fill="#4dd4ac" />
      </motion.g>
    )
  }

  if (type === 'shoulderRoll') {
    return (
      <motion.g
        animate={{ x: [0, 8, 0, -8, 0], y: [0, -14, -2, 12, 0] }}
        transition={transition}
      >
        <line x1="124" y1="160" x2="236" y2="160" stroke="url(#bodyLine)" strokeWidth="11" strokeLinecap="round" />
        <line x1="124" y1="160" x2="102" y2="238" stroke="url(#bodyLine)" strokeWidth="9" strokeLinecap="round" />
        <line x1="236" y1="160" x2="258" y2="238" stroke="url(#bodyLine)" strokeWidth="9" strokeLinecap="round" />
        <circle cx="124" cy="160" r="11" fill="#4dd4ac" />
        <circle cx="236" cy="160" r="11" fill="#4dd4ac" />
      </motion.g>
    )
  }

  return (
    <motion.g animate={{ y: armY }} transition={transition}>
      <line x1="124" y1="154" x2="236" y2="154" stroke="url(#bodyLine)" strokeWidth="11" strokeLinecap="round" />
      <line x1="124" y1="154" x2="92" y2="218" stroke="url(#bodyLine)" strokeWidth="9" strokeLinecap="round" />
      <line x1="236" y1="154" x2="268" y2="218" stroke="url(#bodyLine)" strokeWidth="9" strokeLinecap="round" />
      <circle cx="124" cy="154" r="9" fill="#4dd4ac" />
      <circle cx="236" cy="154" r="9" fill="#4dd4ac" />
      <circle cx="92" cy="218" r="8" fill="#6aa7ff" />
      <circle cx="268" cy="218" r="8" fill="#6aa7ff" />
    </motion.g>
  )
}

export const ExerciseAnimation = ({ type, title }: ExerciseAnimationProps) => {
  const movement = motionFor(type)
  return (
    <div className="animation-stage">
      <div className="panel-label">标准动作演示</div>
      <svg viewBox="0 0 360 360" role="img" aria-label={title} className="exercise-svg">
        <defs>
          <linearGradient id="bodyLine" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#4dd4ac" />
            <stop offset="100%" stopColor="#6aa7ff" />
          </linearGradient>
        </defs>
        <motion.g animate={{ x: movement.headX, rotate: movement.headRotate }} transition={transition} style={{ transformOrigin: '180px 98px' }}>
          <circle cx="180" cy="82" r="33" fill="#eef8ff" stroke="#6aa7ff" strokeWidth="5" />
          <line x1="180" y1="115" x2="180" y2="145" stroke="url(#bodyLine)" strokeWidth="10" strokeLinecap="round" />
        </motion.g>
        <line x1="180" y1="145" x2="180" y2="235" stroke="url(#bodyLine)" strokeWidth="12" strokeLinecap="round" />
        <Arms type={type} armY={movement.armY} />
        <line x1="180" y1="235" x2="132" y2="302" stroke="url(#bodyLine)" strokeWidth="10" strokeLinecap="round" />
        <line x1="180" y1="235" x2="228" y2="302" stroke="url(#bodyLine)" strokeWidth="10" strokeLinecap="round" />
        <circle cx="180" cy="145" r="10" fill="#dffcf2" />
        <circle cx="180" cy="235" r="10" fill="#dffcf2" />
        {type === 'shoulderShrug' && <ShoulderShrugCue />}
        {type === 'shoulderRoll' && <ShoulderRollCue />}
      </svg>
      <div className="animation-caption">{title}</div>
    </div>
  )
}
