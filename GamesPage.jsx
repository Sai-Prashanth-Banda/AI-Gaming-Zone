import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Gamepad } from 'lucide-react';

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

const GamesPage = () => {
  const games = [
    { name: "Space Shooter", path: "/games/space-shooter", description: "Classic arcade space shooter. Defend the galaxy against alien invaders!" },
    { name: "Flappy Clone", path: "/games/flappy-clone", description: "Navigate the bird through tricky pipes. How far can you go?" },
    { name: "2048", path: "/games/2048", description: "Slide tiles to combine numbers and reach the elusive 2048 tile." },
    { name: "Snake", path: "/games/snake", description: "Control the snake, eat apples, and grow as long as possible!" }
  ];

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <motion.h1 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold gradient-text mb-16 text-center"
      >
        Choose Your Adventure
      </motion.h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {games.map((game, index) => (
          <motion.div
            key={game.name}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.03, y: -5, boxShadow: "0px 12px 25px rgba(59, 130, 246, 0.3), 0px 5px 10px rgba(168, 85, 247, 0.2)" }}
            className="glass-effect rounded-xl p-6 flex flex-col items-center text-center transform transition-all duration-300 shadow-lg hover:shadow-purple-500/30 border border-purple-500/20"
          >
            <motion.div 
              className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full mb-5 inline-block"
              whileHover={{ rotate: [0, 15, -10, 15, 0], scale: 1.1}}
              transition={{ duration: 0.5 }}
            >
              <Gamepad className="h-10 w-10 text-purple-300" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-white mb-2">{game.name}</h2>
            <p className="text-white/70 mb-6 text-sm flex-grow">{game.description}</p>
            <Link to={game.path} className="w-full mt-auto">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all group">
                Play Now <Play className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200"/>
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default GamesPage;