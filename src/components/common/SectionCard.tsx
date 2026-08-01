import { motion } from "motion/react";
import type { ReactNode } from "react";

import { MOTION } from "@/constants/theme";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
  padded?: boolean;
  delay?: number;
}

/** The single rounded white surface used across the app. */
export function SectionCard({ children, className, padded = true, delay = 0 }: SectionCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: MOTION.base, ease: MOTION.ease, delay }}
      className={cn("surface-card", padded && "p-5", className)}
    >
      {children}
    </motion.section>
  );
}
