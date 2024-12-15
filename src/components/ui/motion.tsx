import dynamic from "next/dynamic";

export const MotionTableRow = dynamic(() => import("framer-motion").then((mod) => mod.motion.tr), {
    ssr: false,
});
