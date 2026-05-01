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
    case 'shoulderShrug':
      return { headX: [0, 0, 0], headRotate: [0, 0, 0], armY: [8, -12, 8] }
    case 'shoulderRoll':
      return { headX: [0, 0, 0], headRotate: [0, 0, 0], armY: [0, -10, 8, 0] }
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

export const ExerciseAnimation = ({ type, title }: ExerciseAnimationProps) => {
  const movement = motionFor(type)
  const transition = { duration: 3, repeat: Infinity, ease: 'easeInOut' as const }
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
        <motion.g animate={{ y: movement.armY }} transition={transition}>
          <line x1="124" y1="154" x2="236" y2="154" stroke="url(#bodyLine)" strokeWidth="11" strokeLinecap="round" />
          <line x1="124" y1="154" x2="92" y2="218" stroke="url(#bodyLine)" strokeWidth="9" strokeLinecap="round" />
          <line x1="236" y1="154" x2="268" y2="218" stroke="url(#bodyLine)" strokeWidth="9" strokeLinecap="round" />
          <circle cx="124" cy="154" r="9" fill="#4dd4ac" />
          <circle cx="236" cy="154" r="9" fill="#4dd4ac" />
          <circle cx="92" cy="218" r="8" fill="#6aa7ff" />
          <circle cx="268" cy="218" r="8" fill="#6aa7ff" />
        </motion.g>
        <line x1="180" y1="235" x2="132" y2="302" stroke="url(#bodyLine)" strokeWidth="10" strokeLinecap="round" />
        <line x1="180" y1="235" x2="228" y2="302" stroke="url(#bodyLine)" strokeWidth="10" strokeLinecap="round" />
        <circle cx="180" cy="145" r="10" fill="#dffcf2" />
        <circle cx="180" cy="235" r="10" fill="#dffcf2" />
      </svg>
      <div className="animation-caption">{title}</div>
    </div>
  )
}
