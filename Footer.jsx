
import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Github, Linkedin, Mail, Instagram } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: Github, href: "https://github.com/Sai-Prashanth-Banda/", label: "GitHub" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/saiprashanth13", label: "LinkedIn" },
    { icon: Mail, href: "mailto:bandasaiprashanth@gmail.com", label: "Email" },
    { icon: Instagram, href: "https://www.instagram.com/byteme_up/", label: "Instagram" },
  ];
  return (
    <motion.footer 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
      className="relative z-10 glass-effect border-t border-white/10 mt-16 py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white/70">
        <div className="flex justify-center items-center space-x-2 mb-6">
          <Gamepad2 className="h-7 w-7 text-blue-400" />
          <span className="text-lg font-semibold gradient-text">AI Gaming Zone</span>
        </div>
        <p className="mb-6 text-sm">
          Exploring the frontiers of AI-driven entertainment. Play, create, and innovate with us.
        </p>
        <div className="flex justify-center space-x-6 mb-8">
          {socialLinks.map(link => (
            <motion.a 
              key={link.label} 
              href={link.href} 
              target="_blank" 
              rel="noopener noreferrer"
              whileHover={{ scale: 1.2, y: -3, color: "#A78BFA" }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-white/60 hover:text-purple-400 transition-colors"
              aria-label={link.label}
            >
              <link.icon className="h-6 w-6" />
            </motion.a>
          ))}
        </div>
        <p className="text-xs">
          &copy; {new Date().getFullYear()} AI Gaming Zone. All rights reserved. 
          Powered by Imagination & Code.
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
