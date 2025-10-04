import { motion } from "framer-motion";

const transition = (OriginalComponent) => {
  return () => (
    <>
      <OriginalComponent />
       <motion.div
        className="slide-in"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 1 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      /> 
      <motion.div
        className="slide-in-text"
        initial={{ opacity: 1 }} 
        animate={{ opacity: 0 }} 
        exit={{ opacity: 1 }} 
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        🔥
      </motion.div>
      <motion.div
        className="slide-out"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        exit={{ scaleX: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.5}}
      />
    </>
  );
};

export default transition;
