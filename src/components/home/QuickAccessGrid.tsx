import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";

import { IconTile } from "@/components/common/IconTile";
import { QUICK_ACCESS_ITEMS } from "@/constants/navigation";
import { MOTION } from "@/constants/theme";

export function QuickAccessGrid() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {QUICK_ACCESS_ITEMS.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: MOTION.base, ease: MOTION.ease, delay: index * MOTION.stagger }}
        >
          <Link
            to={item.to}
            {...(item.search ? { search: item.search } : {})}
            className="flex flex-col items-center gap-2 rounded-2xl py-1 text-center transition-transform active:scale-95"
          >
            <IconTile icon={item.icon} tone={item.tone} size="lg" />
            <span className="text-[11px] font-semibold leading-tight text-foreground">
              {item.label}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
