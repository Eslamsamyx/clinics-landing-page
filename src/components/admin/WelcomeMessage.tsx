import { motion } from "framer-motion";

export function WelcomeMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10"
    >
      <h2 className="text-4xl font-bold gradient-text mb-2">
        مرحبًا بمدير المنصّة
      </h2>
      <p className="text-lg text-gray-600">إليك نظرة عامة على أداء العيادة اليوم</p>
    </motion.div>
  );
}
