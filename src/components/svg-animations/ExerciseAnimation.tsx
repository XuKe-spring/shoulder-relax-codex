import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import type { AnimationKey } from '../../types'

interface ExerciseAnimationProps {
  type: AnimationKey
  title: string
}

const transition = { duration: 3, repeat: Infinity, ease: 'easeInOut' as const }
const shoulderTransition = { duration: 2.4, repeat: Infinity, ease: 'easeInOut' as const }

const motionFor = (type: AnimationKey) => {
  switch (type) {
    case 'neckSideStretch':
      return { headX: [-6, 10, -6], headRotate: [-10, 12, -10], armY: [0, 0, 0] }
    case 'neckTurn':
      return { headX: [-8, 8, -8], headRotate: [-4, 4, -4], armY: [0, 0, 0] }
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

const ActionPoints = ({ points }: { points: string[] }) => (
  <div className="action-points">
    <strong>动作要点</strong>
    <ol>
      {points.map((point) => <li key={point}>{point}</li>)}
    </ol>
  </div>
)

const FrontBody = ({ children, ariaLabel }: { children?: ReactNode; ariaLabel: string }) => (
  <svg viewBox="0 0 360 360" role="img" aria-label={ariaLabel} className="exercise-svg shoulder-front-svg">
    <defs>
      <linearGradient id="frontBodyLine" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stopColor="#4dd4ac" />
        <stop offset="100%" stopColor="#6aa7ff" />
      </linearGradient>
    </defs>
    <circle cx="180" cy="78" r="32" fill="#eef8ff" stroke="#6aa7ff" strokeWidth="5" />
    <line x1="180" y1="112" x2="180" y2="238" stroke="url(#frontBodyLine)" strokeWidth="12" strokeLinecap="round" />
    <line x1="180" y1="238" x2="134" y2="305" stroke="url(#frontBodyLine)" strokeWidth="10" strokeLinecap="round" />
    <line x1="180" y1="238" x2="226" y2="305" stroke="url(#frontBodyLine)" strokeWidth="10" strokeLinecap="round" />
    {children}
  </svg>
)

const ShoulderShrugViews = () => (
  <div className="dual-action-view">
    <div className="front-view">
      <span className="view-label">正视图</span>
      <FrontBody ariaLabel="耸肩放松正视图">
        <motion.g animate={{ y: [16, -22, 16] }} transition={shoulderTransition}>
          <line x1="122" y1="158" x2="238" y2="158" stroke="url(#frontBodyLine)" strokeWidth="12" strokeLinecap="round" />
          <line x1="122" y1="158" x2="104" y2="238" stroke="url(#frontBodyLine)" strokeWidth="9" strokeLinecap="round" />
          <line x1="238" y1="158" x2="256" y2="238" stroke="url(#frontBodyLine)" strokeWidth="9" strokeLinecap="round" />
          <circle cx="122" cy="158" r="12" fill="#4dd4ac" />
          <circle cx="238" cy="158" r="12" fill="#4dd4ac" />
        </motion.g>
        <motion.g animate={{ y: [12, -18, 12] }} transition={shoulderTransition}>
          <line x1="98" y1="174" x2="98" y2="126" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
          <path d="M84 140 L98 124 L112 140" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="262" y1="174" x2="262" y2="126" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
          <path d="M248 140 L262 124 L276 140" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
      </FrontBody>
    </div>
    <div className="side-view">
      <span className="view-label">侧视图</span>
      <svg viewBox="0 0 190 230" role="img" aria-label="耸肩放松侧视图">
        <circle cx="82" cy="42" r="24" fill="#eef8ff" stroke="#6aa7ff" strokeWidth="4" />
        <line x1="82" y1="68" x2="82" y2="155" stroke="#4dd4ac" strokeWidth="9" strokeLinecap="round" />
        <motion.g animate={{ y: [12, -20, 12] }} transition={shoulderTransition}>
          <circle cx="88" cy="88" r="13" fill="#facc15" />
          <line x1="88" y1="88" x2="106" y2="165" stroke="#6aa7ff" strokeWidth="8" strokeLinecap="round" />
          <circle cx="106" cy="165" r="8" fill="#dffcf2" />
        </motion.g>
        <line x1="132" y1="124" x2="132" y2="72" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
        <path d="M120 84 L132 70 L144 84" fill="none" stroke="#facc15" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <text x="95" y="212" textAnchor="middle" fill="#fef3c7" fontSize="14" fontWeight="800">肩头向上，不抬手</text>
      </svg>
    </div>
    <ActionPoints points={['吸气时肩膀向耳朵方向提起', '呼气时肩膀自然落下', '手臂放松垂下，不主动抬手']} />
  </div>
)

const ShoulderRollViews = () => (
  <div className="dual-action-view">
    <div className="front-view">
      <span className="view-label">正视图</span>
      <FrontBody ariaLabel="肩部环绕正视图">
        <motion.g
          animate={{ y: [0, -18, 0, 16, 0], x: [0, 8, 0, -8, 0] }}
          transition={transition}
        >
          <line x1="122" y1="158" x2="238" y2="158" stroke="url(#frontBodyLine)" strokeWidth="12" strokeLinecap="round" />
          <line x1="122" y1="158" x2="104" y2="238" stroke="url(#frontBodyLine)" strokeWidth="9" strokeLinecap="round" />
          <line x1="238" y1="158" x2="256" y2="238" stroke="url(#frontBodyLine)" strokeWidth="9" strokeLinecap="round" />
          <circle cx="122" cy="158" r="12" fill="#4dd4ac" />
          <circle cx="238" cy="158" r="12" fill="#4dd4ac" />
        </motion.g>
        <path d="M88 158 C92 104 152 104 156 158 C156 210 90 210 88 158" fill="none" stroke="#facc15" strokeDasharray="7 7" strokeWidth="6" />
        <path d="M204 158 C208 104 268 104 272 158 C272 210 206 210 204 158" fill="none" stroke="#facc15" strokeDasharray="7 7" strokeWidth="6" />
        <motion.circle cx="122" cy="104" r="10" fill="#facc15" animate={{ cx: [122, 156, 122, 88, 122], cy: [104, 158, 210, 158, 104] }} transition={transition} />
        <motion.circle cx="238" cy="104" r="10" fill="#facc15" animate={{ cx: [238, 272, 238, 204, 238], cy: [104, 158, 210, 158, 104] }} transition={transition} />
        <text x="122" y="96" textAnchor="middle" fill="#fef3c7" fontSize="16" fontWeight="900">1 上提</text>
        <text x="282" y="164" textAnchor="middle" fill="#fef3c7" fontSize="16" fontWeight="900">2 后绕</text>
        <text x="122" y="230" textAnchor="middle" fill="#fef3c7" fontSize="16" fontWeight="900">3 下沉</text>
      </FrontBody>
    </div>
    <div className="side-view side-view-large">
      <span className="view-label">侧视图</span>
      <svg viewBox="0 0 210 250" role="img" aria-label="肩部环绕侧视图">
        <circle cx="78" cy="42" r="24" fill="#eef8ff" stroke="#6aa7ff" strokeWidth="4" />
        <line x1="78" y1="68" x2="78" y2="165" stroke="#4dd4ac" strokeWidth="9" strokeLinecap="round" />
        <ellipse cx="92" cy="104" rx="30" ry="42" fill="none" stroke="#facc15" strokeDasharray="6 6" strokeWidth="6" />
        <motion.g animate={{ x: [0, 24, 0, -20, 0], y: [-28, 0, 30, 0, -28] }} transition={transition}>
          <circle cx="92" cy="104" r="14" fill="#facc15" />
          <line x1="92" y1="104" x2="114" y2="184" stroke="#6aa7ff" strokeWidth="8" strokeLinecap="round" />
          <circle cx="114" cy="184" r="8" fill="#dffcf2" />
        </motion.g>
        <path d="M132 70 C170 86 170 124 132 148" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
        <path d="M132 148 L134 127 L152 138" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <text x="116" y="226" textAnchor="middle" fill="#fef3c7" fontSize="15" fontWeight="900">肩头向上、向后、向下滚动</text>
      </svg>
    </div>
    <ActionPoints points={['肩膀先向上提，不要耸住', '再向后绕，像把肩胛骨带到身后', '最后向下沉肩，手臂始终放松']} />
  </div>
)

const ChestOpenViews = () => (
  <div className="dual-action-view">
    <div className="front-view">
      <span className="view-label">正视图</span>
      <FrontBody ariaLabel="开胸扩胸正视图">
        <line x1="122" y1="158" x2="238" y2="158" stroke="url(#frontBodyLine)" strokeWidth="12" strokeLinecap="round" />
        <circle cx="122" cy="158" r="11" fill="#4dd4ac" />
        <circle cx="238" cy="158" r="11" fill="#4dd4ac" />
        <motion.g transition={transition} animate={{ opacity: [0.55, 1, 0.55] }}>
          <motion.line x1="122" y1="158" stroke="#6aa7ff" strokeWidth="9" strokeLinecap="round" animate={{ x2: [98, 72, 98], y2: [224, 188, 224] }} transition={transition} />
          <motion.line x1="238" y1="158" stroke="#6aa7ff" strokeWidth="9" strokeLinecap="round" animate={{ x2: [262, 288, 262], y2: [224, 188, 224] }} transition={transition} />
          <motion.circle r="8" fill="#dffcf2" animate={{ cx: [98, 72, 98], cy: [224, 188, 224] }} transition={transition} />
          <motion.circle r="8" fill="#dffcf2" animate={{ cx: [262, 288, 262], cy: [224, 188, 224] }} transition={transition} />
        </motion.g>
        <path d="M145 160 C130 176 110 184 82 184" fill="none" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
        <path d="M215 160 C230 176 250 184 278 184" fill="none" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
        <text x="180" y="334" textAnchor="middle" fill="#fef3c7" fontSize="18" fontWeight="900">手臂向后打开，胸口展开</text>
      </FrontBody>
    </div>
    <div className="side-view side-view-large">
      <span className="view-label">侧视图</span>
      <svg viewBox="0 0 210 250" role="img" aria-label="开胸扩胸侧视图">
        <circle cx="88" cy="42" r="24" fill="#eef8ff" stroke="#6aa7ff" strokeWidth="4" />
        <line x1="88" y1="68" x2="88" y2="168" stroke="#4dd4ac" strokeWidth="9" strokeLinecap="round" />
        <circle cx="92" cy="96" r="12" fill="#4dd4ac" />
        <motion.g animate={{ x: [24, -34, 24], y: [16, -8, 16] }} transition={transition}>
          <line x1="92" y1="96" x2="112" y2="176" stroke="#6aa7ff" strokeWidth="8" strokeLinecap="round" />
          <circle cx="112" cy="176" r="8" fill="#dffcf2" />
        </motion.g>
        <path d="M142 114 C104 96 72 92 40 106" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" />
        <path d="M44 106 L62 94 L60 114" fill="none" stroke="#facc15" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <text x="104" y="226" textAnchor="middle" fill="#fef3c7" fontSize="15" fontWeight="900">手臂往身体后方打开</text>
      </svg>
    </div>
    <ActionPoints points={['手臂从身体两侧向后打开', '胸口向前展开，肩胛骨轻轻靠近', '不要塌腰，肋骨保持稳定']} />
  </div>
)

export const ExerciseAnimation = ({ type, title }: ExerciseAnimationProps) => {
  const movement = motionFor(type)

  if (type === 'shoulderShrug' || type === 'shoulderRoll' || type === 'chestOpen') {
    return (
      <div className="animation-stage">
        <div className="panel-label">标准动作演示</div>
        {type === 'shoulderShrug' && <ShoulderShrugViews />}
        {type === 'shoulderRoll' && <ShoulderRollViews />}
        {type === 'chestOpen' && <ChestOpenViews />}
        <div className="animation-caption">{title}</div>
      </div>
    )
  }

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
