// /components/TokenFarm.js

"use client";  // Это делает компонент клиентским

import { useState, useEffect } from 'react';

export default function TokenFarm() {
  const [tokens, setTokens] = useState(0);
  const [nextFarmTime, setNextFarmTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState(null);

  const TOKENS_PER_FARM = 95.50;
  const FARM_INTERVAL = 6 * 60 * 60 * 1000;

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

  return (
    <div>
      <p>Tokens farmed: {tokens.toFixed(2)}</p>
      <button
        onClick={startFarm}
        style={styles.button}
        disabled={timeLeft > 0}
      >
        Start Farm
      </button>
      {timeLeft > 0 && (
        <p>Next farm available in: {formatTimeLeft(timeLeft)}</p>
      )}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: '20px',
  },
};
