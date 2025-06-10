import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Gamepad2, Home as HomeIcon, ToyBrick, Brain, Menu, X } from 'lucide-react';

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Games", path: "/games", icon: ToyBrick },
    { name: "Create", path: "/create", icon: Brain },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeInOut" } }
  };

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="sticky top-0 z-50 glass-effect border-b border-white/10 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Gamepad2 className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-md group-hover:blur-lg transition-all"></div>
              </div>
              <span className="text-xl font-bold gradient-text group-hover:opacity-80 transition-opacity">AI Gaming Zone</span>
            </Link>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link to={link.path} className="text-white/80 hover:text-white transition-colors duration-300 font-medium flex items-center group">
                  <link.icon className="mr-2 h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" /> {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/games">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-full glow-effect shadow-md hover:shadow-lg transition-all">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="md:hidden">
            <motion.button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-all"
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden glass-effect border-t border-white/10 absolute w-full"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)} 
                  className="text-white/80 hover:bg-white/10 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 flex items-center group"
                >
                  <link.icon className="mr-3 h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  {link.name}
                </Link>
              ))}
              <div className="pt-2 pb-1 px-2">
                <Link to="/games" onClick={() => setMobileMenuOpen(false)} >
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-full glow-effect shadow-md hover:shadow-lg transition-all">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default NavBar;