"use client";  // Это делает компонент клиентским

import { useState, useEffect } from 'react';

export default function TokenFarm() {
  const [tokens, setTokens] = useState(0);
  const [nextFarmTime, setNextFarmTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState(null);
  const [isFarming, setIsFarming] = useState(false); // Отслеживание процесса фарминга
  const [intervalId, setIntervalId] = useState(null);

  const TOKENS_PER_FARM = 95.50;
  const FARM_INTERVAL = 6 * 60 * 60 * 1000; // 6 часов в миллисекундах
  const TOKEN_INCREMENT = 0.01; // Токены будут начисляться по 0.01

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

    setIsFarming(true); // Запуск процесса фарминга
    setError(null);

    const newNextFarmTime = now + FARM_INTERVAL;
    setNextFarmTime(newNextFarmTime);
    localStorage.setItem('nextFarmTime', newNextFarmTime);

    // Начало плавного начисления токенов
    const totalTicks = FARM_INTERVAL / 1000; // Количество шагов за 6 часов (1 шаг в секунду)
    const incrementPerTick = TOKENS_PER_FARM / totalTicks;

    const farmingInterval = setInterval(() => {
      setTokens((prevTokens) => {
        const newTokenCount = prevTokens + incrementPerTick;
        localStorage.setItem('tokens', newTokenCount.toFixed(2));
        return newTokenCount;
      });

      const timeRemaining = newNextFarmTime - Date.now();
      setTimeLeft(timeRemaining);

      if (timeRemaining <= 0) {
        clearInterval(farmingInterval);
        setIsFarming(false); // Завершение процесса фарминга
      }
    }, 1000); // Каждую секунду начисляем токены

    setIntervalId(farmingInterval); // Сохранение ID интервала, чтобы можно было его очистить
  };

  useEffect(() => {
    // Очистка интервала при размонтировании компонента
    return () => clearInterval(intervalId);
  }, [intervalId]);

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
    <div className='farming'>
      <div className='tokens-counter'>{tokens.toFixed(2)}</div>
      <button
        onClick={startFarm}
        style={{
          ...styles.button,
          background: isFarming
            ? `linear-gradient(to left, #7fffd4 ${progressPercentage}%, #e0e0e0 ${progressPercentage}%)`
            : '#007bff'
        }}
        disabled={isFarming || timeLeft > 0}
      >
        {isFarming ? `Next farm  ${formatTimeLeft(timeLeft)}` : 'Start Farm'}
      </button>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  button: {
    height: '48px',
    fontSize: '18px',
    backgroundColor: '#7fffd4',
    color: '#212121',
    border: 'none',
    borderRadius: '8px',
    fontWeight:'600',
    fontFamily: 'Lato',
    cursor: 'pointer',
    transition: 'background 0.5s ease',
    width: '100%', // Подгон ширины кнопки
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: '20px',
  },
};
