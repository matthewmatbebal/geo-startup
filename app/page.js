"use client";  // Это делает компонент клиентским

import { useEffect, useState } from "react";
import MainLayout from "./components/MainLayout";
import UserProfile from "./components/UserProfile";
import TokenFarm from "./components/TokenFarm";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
      if (telegramUser) {
        setUser({
          username: telegramUser.username || 'User',
          photoUrl: telegramUser.photo_url || null,
        });
      }
    }
  }, []);

  return (
    <MainLayout>
      {user ? (
        <>
          <UserProfile username={user.username} photoUrl={user.photoUrl} />
          <TokenFarm />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </MainLayout>
  );
}