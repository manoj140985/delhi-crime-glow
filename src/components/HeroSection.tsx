import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center py-8 px-4"
    >
      <h1 className="text-5xl md:text-7xl font-bold mb-4">
        <span className="bg-gradient-to-r from-cyber-cyan via-cyber-red to-cyber-cyan bg-clip-text text-transparent glow-text animate-pulse">
          Delhi Crime Forecast
        </span>
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg md:text-xl text-muted-foreground"
      >
        Predictive Analytics for Delhi Crime Trends (2011-2026)
      </motion.p>
    </motion.div>
  );
};
