import React, { useState, useEffect } from 'react';
import './App.css';
// import Hamster from './icons/Hamster'; // Unused import
import { danceIcon, inviteIcon, leaderboardIcon, mainCharacter, playIcon, walletIcon } from './images';
// import Info from './icons/Info'; // Unused import

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

  // Unused variable
  // const levelMinPoints = [
  //   0,        // Beginner
  //   5000,     // Groover
  //   25000,    // Mover
  //   100000,   // Performer
  //   1000000,  // ChoreoGrapher
  //   2000000,  // Star
  //   10000000, // Dance Pro
  //   50000000, // Dance Master
  //   100000000,// Dance Legend
  //   1000000000// Dance Icon
  // ];

  const [levelIndex] = useState(6);
  const [points, setPoints] = useState(0);
  const [clicks, setClicks] = useState<{ id: number, x: number, y: number }[]>([]);
  const pointsToAdd = 20;
  // const profitPerHour = 5000; // Unused variable

  const [maxEnergy] = useState(2500); // Set max energy to 2500
  const [currentEnergy] = useState(maxEnergy)[0]; // setCurrentEnergy is not used

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
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(17));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(17));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY } = event;
    setPoints(points + pointsToAdd);
    setClicks([...clicks, { id: Date.now(), x: clientX, y: clientY }]);
  };

  const handleAnimationEnd = (id: number) => {
    setClicks((prevClicks) => prevClicks.filter((click) => click.id !== id));
  };

  return (
    <div className="App" onClick={handleClick}>
      <header className="App-header">
        <img src={mainCharacter} className="App-logo" alt="logo" />
        <p>{levelNames[levelIndex]}</p>
        <p>{`Points: ${points}`}</p>
        <p>{`Energy: ${currentEnergy}/${maxEnergy}`}</p>
        <p>{`Time Left: ${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}</p>
      </header>
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
  );
};

export default App;