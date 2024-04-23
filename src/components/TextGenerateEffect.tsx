"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

/**
 * This component is from
 * https://ui.aceternity.com/components/text-generate-effect
 */
export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const controls = useAnimation();
  const wordsArray = words.split(" ");

  useEffect(() => {
    const sequence = async () => {
      await controls.start((i) => ({
        opacity: 1,
        transition: { delay: i * 0.05 },
      }));
    };
    sequence();
  }, [words, controls]);

  return (
    <div className={className}>
      <motion.div className="text-[16px] leading-snug">
        {wordsArray.map((word, index) => (
          <motion.span
            key={index}
            custom={index}
            initial={{ opacity: 0 }}
            animate={controls}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    </div>
  );
};
