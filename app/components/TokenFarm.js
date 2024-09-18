"use client";  // Это делает компонент клиентским

import { useState, useEffect } from 'react';

export default function TokenFarm() {
  const [tokens, setTokens] = useState(0);
  const [nextFarmTime, setNextFarmTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState(null);

  const TOKENS_PER_FARM = 95.50;
  const FARM_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

  useEffect(() => {
    const storedTokens = parseFloat(localStorage.getItem('tokens')) || 0;
    const storedNextFarmTime = parseInt(localStorage.getItem('nextFarmTime'), 10) || null;
    setTokens(storedTokens);
    setNextFarmTime(storedNextFarmTime);

    const intervalId = setInterval(() => {
      if (storedNextFarmTime) {
        const timeRemaining = storedNextFarmTime - Date.now();
        setTimeLeft(timeRemaining > 0 ? timeRemaining : 0);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const startFarm = () => {
    const now = Date.now();

    if (nextFarmTime && now < nextFarmTime) {
      setError(`You can farm again in ${Math.ceil(timeLeft / 1000 / 60)} minutes.`);
      return;
    }

    const newTokenCount = tokens + TOKENS_PER_FARM;
    setTokens(newTokenCount);

    const newNextFarmTime = now + FARM_INTERVAL;
    setNextFarmTime(newNextFarmTime);

    localStorage.setItem('tokens', newTokenCount);
    localStorage.setItem('nextFarmTime', newNextFarmTime);

    setError(null);
  };

  const formatTimeLeft = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const progressPercentage = nextFarmTime
    ? ((FARM_INTERVAL - timeLeft) / FARM_INTERVAL) * 100
    : 0;

  return (
    <div>
      <p>Tokens farmed: {tokens.toFixed(2)}</p>
      <button
        onClick={startFarm}
        style={{
          ...styles.button,
          background: timeLeft > 0
            ? `linear-gradient(to left, #007bff ${progressPercentage}%, #e0e0e0 ${progressPercentage}%)`
            : '#007bff'
        }}
        disabled={timeLeft > 0}
      >
        {timeLeft > 0 ? `Next farm available in: ${formatTimeLeft(timeLeft)}` : 'Start Farm'}
      </button>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.5s ease',
    width: '300px', // Adjust width as needed
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: '20px',
  },
};