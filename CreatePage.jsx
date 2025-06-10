
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Brain, Link as LinkIcon, Award } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const CreatePage = ({ toastFn }) => {
  const reportLink = "https://drive.google.com/file/d/1-w8dm8JOnggf-UiRBvVEHCmW8MDnWAiS/view?usp=sharing";

  const handleNotifyClick = () => {
    if (toastFn && typeof toastFn === 'function') {
      toastFn({
        title: (
          <div className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-yellow-400" />
            <span className="font-semibold">Achievement Unlocked!</span>
          </div>
        ),
        description: (
          <div className="flex flex-col space-y-2">
            <p>You've found a hidden scroll: Project Insights!</p>
            <a
              href={reportLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200 group"
            >
              <LinkIcon className="h-4 w-4 mr-1.5 transform transition-transform duration-200 group-hover:rotate-[-15deg]" />
              View Detailed Report
            </a>
          </div>
        ),
        variant: "default",
        duration: 9000, 
      });
    }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, type: "spring", stiffness: 100 }}
        className="mb-8"
      >
        <Brain className="h-24 w-24 text-purple-400 mx-auto" />
      </motion.div>
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold gradient-text mb-6"
      >
        Unleash Your Inner Game Designer
      </motion.h1>
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
        className="text-xl text-white/80 mb-10"
      >
        Our AI-powered game creation tools are coming soon! Get ready to bring your wildest game ideas to life with just a few clicks. No coding required.
      </motion.p>
      <motion.div
        initial={{ opacity:0, y:20 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
      >
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold px-10 py-6 rounded-full text-lg shadow-xl hover:shadow-2xl transition-all"
          onClick={handleNotifyClick}
        >
          Notify Me When It's Ready!
        </Button>
      </motion.div>
      <motion.div 
        className="mt-16 p-8 glass-effect rounded-xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-2xl font-semibold text-white mb-4">What to Expect:</h2>
        <ul className="list-disc list-inside text-left text-white/70 space-y-2 max-w-md mx-auto">
          <li>Intuitive drag-and-drop interface.</li>
          <li>AI-assisted asset generation (characters, environments, etc.).</li>
          <li>Genre templates to get you started quickly.</li>
          <li>Real-time preview and testing.</li>
          <li>One-click publishing to the AI Gaming Zone.</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default CreatePage;
