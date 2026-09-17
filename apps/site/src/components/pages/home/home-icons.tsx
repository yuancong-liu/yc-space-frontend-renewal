'use client';

import { motion } from 'motion/react';
import type { Variants } from 'motion/react';

const LY_MARK_PATH =
  'M178.527 81.1323C125.062 81.1323 81.72 124.163 81.72 177.243C81.72 230.323 125.062 273.354 178.527 273.354C231.992 273.354 275.334 230.323 275.334 177.243C275.334 124.163 231.992 81.1323 178.527 81.1323ZM0 177.243C0 79.3544 79.9292 0 178.527 0C277.125 0 357.054 79.3544 357.054 177.243C357.054 275.132 277.125 354.486 178.527 354.486C79.9292 354.486 0 275.132 0 177.243Z';

const C_MARK_PATH =
  'M114.933 203.448L0.859375 166.934L27.9364 83.5209L142.37 120.15V0.0281677H230.627V119.799L345.458 82.344L373 165.607L257.901 203.149L329.315 300.345L258.019 352L186.527 254.699L115.628 351.347L44.2917 299.746L114.933 203.448Z';

const lyMarkVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: [0, 0, 1],
    transition: { duration: 3, ease: 'easeInOut' },
  },
};

const cMarkVariants: Variants = {
  hidden: { rotate: 180 },
  visible: {
    rotate: [180, 0, 0],
    transition: { duration: 3, ease: 'easeInOut' },
  },
};

const cMarkPathVariants: Variants = {
  hidden: {
    pathLength: 0,
    fill: 'var(--color-text-transparent)',
  },
  visible: {
    pathLength: [0, 1, 1],
    fill: [
      'var(--color-text-transparent)',
      'var(--color-text-transparent)',
      'var(--color-text)',
    ],
    transition: { duration: 3, ease: 'easeInOut' },
  },
};

export const HomeIcons = () => (
  <div className="home-stage">
    {/* Desktop */}
    <div className="hidden gap-[8%] md:flex" style={{ width: 'min(80%, 80vw)' }}>
      <motion.svg
        animate="visible"
        fill="none"
        height="355"
        initial="hidden"
        variants={lyMarkVariants}
        viewBox="0 0 358 355"
        width="358"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-text"
          clipRule="evenodd"
          d={LY_MARK_PATH}
          fillRule="evenodd"
        />
      </motion.svg>

      <motion.svg
        animate="visible"
        fill="none"
        height="355"
        initial="hidden"
        variants={lyMarkVariants}
        viewBox="0 0 358 355"
        width="358"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-text"
          clipRule="evenodd"
          d={LY_MARK_PATH}
          fillRule="evenodd"
        />
      </motion.svg>

      <motion.svg
        animate="visible"
        className="cursor-pointer"
        fill="none"
        height="352"
        initial="hidden"
        variants={cMarkVariants}
        viewBox="0 0 373 352"
        whileHover={{
          rotate: 360,
          transition: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 3,
            ease: 'easeInOut',
          },
        }}
        width="373"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          animate="visible"
          className="stroke-surface-2 stroke-2"
          clipRule="evenodd"
          d={C_MARK_PATH}
          fillRule="evenodd"
          initial="hidden"
          variants={cMarkPathVariants}
        />
      </motion.svg>
    </div>

    {/* Mobile */}
    <div className="flex flex-col items-center gap-[26px] md:hidden" style={{ width: '60%' }}>
      <motion.svg
        animate="visible"
        className="w-full"
        fill="none"
        height="194"
        initial="hidden"
        variants={lyMarkVariants}
        viewBox="0 0 195 194"
        width="195"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-text"
          clipRule="evenodd"
          d="M97.777 44.3692C68.7621 44.3692 45.2408 67.9014 45.2408 96.9297C45.2408 125.958 68.7621 149.49 97.777 149.49C126.792 149.49 150.313 125.958 150.313 96.9297C150.313 67.9014 126.792 44.3692 97.777 44.3692ZM0.89209 96.9297C0.89209 43.3969 44.2689 0 97.777 0C151.285 0 194.662 43.3969 194.662 96.9297C194.662 150.463 151.285 193.859 97.777 193.859C44.2689 193.859 0.89209 150.463 0.89209 96.9297Z"
          fillRule="evenodd"
        />
      </motion.svg>

      <motion.svg
        animate="visible"
        className="w-full"
        fill="none"
        height="194"
        initial="hidden"
        variants={lyMarkVariants}
        viewBox="0 0 195 194"
        width="195"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-text"
          clipRule="evenodd"
          d="M97.777 44.3692C68.7621 44.3692 45.2408 67.9014 45.2408 96.9297C45.2408 125.958 68.7621 149.49 97.777 149.49C126.792 149.49 150.313 125.958 150.313 96.9297C150.313 67.9014 126.792 44.3692 97.777 44.3692ZM0.89209 96.9297C0.89209 43.3969 44.2689 0 97.777 0C151.285 0 194.662 43.3969 194.662 96.9297C194.662 150.463 151.285 193.859 97.777 193.859C44.2689 193.859 0.89209 150.463 0.89209 96.9297Z"
          fillRule="evenodd"
        />
      </motion.svg>

      <motion.svg
        animate="visible"
        className="w-full cursor-pointer"
        fill="none"
        height="191"
        initial="hidden"
        variants={cMarkVariants}
        viewBox="0 0 201 191"
        whileTap={{ scale: 0.9, rotate: 45 }}
        width="201"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          animate="visible"
          className="stroke-surface-2 stroke-2"
          clipRule="evenodd"
          d="M61.6135 110.402L0 90.5905L14.6248 45.3339L76.4325 65.2074V0.0340576H124.102V65.0168L186.124 44.6954L201 89.8705L138.833 110.239L177.405 162.974L138.896 191L100.282 138.209L61.9887 190.646L23.4586 162.649L61.6135 110.402Z"
          fillRule="evenodd"
          initial="hidden"
          variants={cMarkPathVariants}
        />
      </motion.svg>
    </div>
  </div>
);
