
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';

import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import GamesPage from '@/pages/GamesPage';
import CreatePage from '@/pages/CreatePage';
import GameLayout from '@/components/GameLayout';

import SpaceShooterGame from '@/components/games/SpaceShooterGame';
import FlappyCloneGame from '@/components/games/FlappyCloneGame';
import Game2048 from '@/components/games/Game2048';
import SnakeGame from '@/components/games/SnakeGame';


function App() {
  const location = useLocation();
  const { toast } = useToast();


  return (
    <Layout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/games" element={<GamesPage />} />
          <Route path="/create" element={<CreatePage toastFn={toast} />} />
          <Route path="/games/space-shooter" element={
            <GameLayout gameName="Space Shooter">
              <SpaceShooterGame />
            </GameLayout>
          } />
          <Route path="/games/flappy-clone" element={
            <GameLayout gameName="Flappy Clone">
              <FlappyCloneGame />
            </GameLayout>
          } />
          <Route path="/games/2048" element={
            <GameLayout gameName="2048 Game">
              <Game2048 />
            </GameLayout>
          } />
          <Route path="/games/snake" element={
            <GameLayout gameName="Snake">
              <SnakeGame />
            </GameLayout>
          } />
        </Routes>
      </AnimatePresence>
      <Toaster />
    </Layout>
  );
}

export default App;
