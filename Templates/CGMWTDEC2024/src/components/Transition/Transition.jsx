import { motion } from "framer-motion";
import { useEffect } from "react";
import "./Transition.css";
import withBase from "../../utils/assetPath";

const Transition = (OriginalComponent, transitionText = "loading") => {
  return () => {
    useEffect(() => {
      document.body.style.overflow = "hidden";

      const timeoutId = setTimeout(() => {
        document.body.style.overflow = "unset";
      }, 1000);

      window.scrollTo({
        top: 0,
        behavior: "instant",
      });

      return () => {
        clearTimeout(timeoutId);
        document.body.style.overflow = "hidden";
      };
    }, []);

    return (
      <>
        <OriginalComponent />

        <motion.div
          className="slide-in"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="loader-bg">
            <img src={withBase("loader/loader-bg.jpg")} alt="" />
          </div>
          <p className="transition-text">
            origin <span>studio</span>
          </p>
        </motion.div>

        <motion.div
          className="slide-out"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <div className="loader-bg">
            <img src={withBase("loader/loader-bg.jpg")} alt="" />
          </div>
          <p className="transition-text">
            origin <span>studio</span>
          </p>
        </motion.div>
      </>
    );
  };
};

export default Transition;
