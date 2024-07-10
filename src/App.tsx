import React, { useState, useEffect } from 'react';
import './App.css';
import Hamster from './icons/Hamster';
import { danceIcon, dollarCoin, inviteIcon, leaderboardIcon, mainCharacter, playIcon, walletIcon } from './images';
import Info from './icons/Info';


const App: React.FC = () => {
  const levelNames = [
    "Beginner",    // From 0 to 4999 coins
    "Groover",    // From 5000 coins to 24,999 coins
    "Mover",      // From 25,000 coins to 99,999 coins
    "Performer",  // From 100,000 coins to 999,999 coins
    "ChoreoGrapher",   // From 1,000,000 coins to 2,000,000 coins
    "Star",      // From 2,000,000 coins to 10,000,000 coins
    "Dance Pro", // From 10,000,000 coins to 50,000,000 coins
    "Dance Master",    // From 50,000,000 coins to 100,000,000 coins
    "Dance Legend", // From 100,000,000 coins to 1,000,000,000 coins
    "Dance Icon"       // From 1,000,000,000 coins to ∞
  ];

  const levelMinPoints = [
    0,        // Beginner
    5000,     // Groover
    25000,    // Mover
    100000,   // Performer
    1000000,  // ChoreoGrapher
    2000000,  // Star
    10000000, // Dance Pro
    50000000, // Dance Master
    100000000,// Dance Legend
    1000000000// Dance Icon
  ];

  const [levelIndex, setLevelIndex] = useState(6);
  const [points, setPoints] = useState(0);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const pointsToAdd = 20;
  const profitPerHour = 5000;

  const [dailyRewardTimeLeft, setDailyRewardTimeLeft] = useState("");
  const [dailyCipherTimeLeft, setDailyCipherTimeLeft] = useState("");
  const [dailyComboTimeLeft, setDailyComboTimeLeft] = useState("");

  const [maxEnergy] = useState(2500); // Set max energy to 2500
  const [currentEnergy, setCurrentEnergy] = useState(maxEnergy);



  const calculateTimeLeft = (targetHour: number) => {
    const now = new Date();
    const target = new Date(now);
    target.setUTCHours(targetHour, 0, 0, 0);

    if (now.getUTCHours() >= targetHour) {
      target.setUTCDate(target.getUTCDate() + 1);
    }

    const diff = target.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    const paddedHours = hours.toString().padStart(2, '0');
    const paddedMinutes = minutes.toString().padStart(2, '0');

    return `${paddedHours}:${paddedMinutes}`;
  };

  useEffect(() => {
    const updateCountdowns = () => {
      setDailyRewardTimeLeft(calculateTimeLeft(0));
      setDailyCipherTimeLeft(calculateTimeLeft(19));
      setDailyComboTimeLeft(calculateTimeLeft(12));
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentEnergy > 0) {
      // Existing code for card animation
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      card.style.transform = `perspective(1000px) rotateX(${-y / 10}deg) rotateY(${x / 10}deg)`;
      setTimeout(() => {
        card.style.transform = '';
      }, 100);
  
      // Update points and energy
      setPoints(points + pointsToAdd);
      setCurrentEnergy(currentEnergy - 1);
      setClicks([...clicks, { id: Date.now(), x: e.pageX, y: e.pageY }]);
    } else {
      // Display message indicating no energy
      console.warn("Out of energy!"); // Or display a UI element
    }
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter(click => click.id !== id));
  };

  const calculateProgress = () => {
    if (levelIndex >= levelNames.length - 1) {
      return 100;
    }
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    const progress = ((points - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100;
    return Math.min(progress, 100);
  };

  useEffect(() => {
    const currentLevelMin = levelMinPoints[levelIndex];
    const nextLevelMin = levelMinPoints[levelIndex + 1];
    
    if (points >= nextLevelMin && levelIndex < levelNames.length - 1) {
      setLevelIndex(levelIndex + 1);
    } else if (points < currentLevelMin && levelIndex > 0) {
      setLevelIndex(levelIndex - 1);
    }
  }, [points, levelIndex, levelMinPoints, levelNames.length]);

  const formatProfitPerHour = (profit: number) => {
    if (profit >= 1000000000) return `+${(profit / 1000000000).toFixed(2)}B`;
    if (profit >= 1000000) return `+${(profit / 1000000).toFixed(2)}M`;
    if (profit >= 1000) return `+${(profit / 1000).toFixed(2)}K`;
    return `+${profit}`;
  };

  useEffect(() => {
    const regenerateEnergy = () => {
      const regenerationAmount = Math.min(2, maxEnergy - currentEnergy); // Max 2 regen per second
      setCurrentEnergy(prevEnergy => Math.min(prevEnergy + regenerationAmount, maxEnergy));
    };
  
    const intervalId = setInterval(regenerateEnergy, 1000); // Check every second
  
    // Update points per second based on profit per hour
    const pointsPerSecond = Math.floor(profitPerHour / 3600);
    const updatePoints = setInterval(() => {
      setPoints(prevPoints => prevPoints + pointsPerSecond);
    }, 60000); // Update points every minute
  
    return () => {
      clearInterval(intervalId);
      clearInterval(updatePoints);
    };
  }, [currentEnergy, maxEnergy, profitPerHour]);

  return (
    <div className="bodyy">
      <div className="bodyy">
        <div className="nav-top">
          <div className="flex items-center space-x-2 pt-4">
            <div className="p-1 rounded-lg bg-[#1d2025]">
              <Hamster size={24} className="text-[#fff]" />
            </div>
            <div>
              <p className="text-sm">Benny (CEO)</p>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-4 mt-1">
            <div className="flex items-center w-1/3">
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="text-sm">{levelNames[levelIndex]}</p>
                  <p className="text-sm">{levelIndex + 1} <span className="text-[#95908a]">/ {levelNames.length}</span></p>
                </div>
                <div className="flex items-center mt-1 border-2 border-[#43433b] rounded-full">
                  <div className="w-full h-2 bg-[#43433b]/[0.6] rounded-full">
                    <div className="progress-gradient h-2 rounded-full" style={{ width: `${calculateProgress()}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center w-2/3 border-2 border-[#43433b] px-4 py-[2px] bg-[#43433b]/[0.6] max-w-48">
              
              <div className="flex-1 text-center">
                <p className="text-xs text-[#85827d] font-medium">Profit per hour</p>
                <div className="flex items-center justify-center space-x-1">
                  <img src={dollarCoin} alt="Dollar Coin" className="w-[14px] h-[auto]" />
                  <p className="text-sm">{formatProfitPerHour(profitPerHour)}</p>
                  <Info size={20} className="text-[#43433b]" />
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <div className="mmmain-character-container">
          <div className="mmain-character-container">
            <div className="">
              
            </div>

            

            <div className="main-character-container">
              <div
                className="character-container"
                onClick={handleCardClick}
              >
                <div className="character-container">
                  <img src={mainCharacter} alt="Main Character" className="main-character" />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* Bottom fixed div */}
      <div className="Navs_container">
      <div className="nav-bottom-enerymove">
          <div className="nav-bottom-blue">
            <p className="text-2xl text-white">{currentEnergy}/{maxEnergy}</p>
            <div className="px-2 mt-1 flex justify-center">
                <div className="px-4 py-2 flex items-center space-x-3">
                  <img src={dollarCoin} alt="Dollar Coin" className="w-4 h-auto" />
                  <p className="text-0.8xl text-white">Energy</p>
                </div>
              </div>
          </div>
          <div className="nav-bottom-pink">
            <p className="text-2xl text-white">{points.toLocaleString()}</p>
            <div className="px-2 mt-1 flex justify-center">
                <div className="px-4 py-2 flex items-center space-x-3">
                  <img src={dollarCoin} alt="Dollar Coin" className="w-4 h-auto" />
                  <p className="text-0.7xl text-white">Dance Moves</p>
                </div>
              </div>
          </div>
      </div>
      <div className="nav-bottom">
        <div className="icon-nav-container">
          <img src={walletIcon} alt="Exchange" className="icon-nav" />
          <p className="mt-1">Earn</p>
        </div>
        <div className="icon-nav-container">
        <img src={danceIcon} alt="Exchange" className="icon-nav" />
          <p className="mt-1">Upgrade</p>
        </div>
        <div className="icon-nav-container">
        <img src={playIcon} alt="Exchange" className="icon-nav" />
          <p className="mt-1">Play</p>
        </div>
        <div className="icon-nav-container">
        <img src={leaderboardIcon} alt="Exchange" className="icon-nav" />
          <p className="mt-1">Leaderboard</p>
        </div>
        <div className="icon-nav-container">
          <img src={inviteIcon} alt="Airdrop" className="icon-nav" />
          <p className="mt-1">Invite</p>
        </div>
      </div>

      {clicks.map((click) => (
        <div
          key={click.id}
          className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
          style={{
            top: `${click.y - 42}px`,
            left: `${click.x - 28}px`,
            animation: `float 1s ease-out`
          }}
          onAnimationEnd={() => handleAnimationEnd(click.id)}
        >
          {pointsToAdd}
        </div>
      ))}
    </div>
    </div>
  );
};

export default App;
