import { motion, useTransform, type MotionValue } from 'framer-motion';

interface Props {
  px: MotionValue<number>;
  py: MotionValue<number>;
}

/** Distant island silhouettes resting on the horizon, drifting with the
 *  pointer for depth. Two parallax layers (far + near). */
export function IslandSilhouettes({ px, py }: Props) {
  const farX = useTransform(px, [-1, 1], [-10, 10]);
  const nearX = useTransform(px, [-1, 1], [-26, 26]);
  const driftY = useTransform(py, [-1, 1], [-5, 5]);

  return (
    <div className="absolute inset-x-0 bottom-[40%] h-[18%]">
      {/* Far layer — faint, small */}
      <motion.svg
        style={{ x: farX, y: driftY }}
        className="absolute bottom-0 left-0 h-full w-full opacity-30"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M0 200 L0 150 Q120 120 200 140 Q260 100 340 135 L380 200 Z M780 200 L760 150 Q860 110 940 138 Q1010 118 1080 150 L1110 200 Z"
          fill="rgb(8 22 48 / 0.85)"
        />
      </motion.svg>

      {/* Near layer — darker, larger, with a tiny palm hint */}
      <motion.svg
        style={{ x: nearX, y: driftY }}
        className="absolute bottom-0 left-0 h-full w-full opacity-60"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M120 200 L100 120 Q220 70 330 110 Q420 60 520 120 L560 200 Z"
          fill="rgb(4 12 30 / 0.95)"
        />
        <path
          d="M880 200 L860 150 Q960 95 1060 140 Q1130 110 1200 150 L1200 200 Z"
          fill="rgb(4 12 30 / 0.95)"
        />
      </motion.svg>
    </div>
  );
}
