// /components/UserProfile.js

"use client";  // Это делает компонент клиентским

export default function UserProfile({ username, photoUrl }) {
  return (
    <div>
      <h1>Welcome, {username}</h1>
      {photoUrl && (
        <img src={photoUrl} alt="User Avatar" style={styles.avatar} />
      )}
    </div>
  );
}

const styles = {
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginTop: '20px',
  },
};
