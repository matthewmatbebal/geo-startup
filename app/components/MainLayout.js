export default function MainLayout({ children }) {
    return (
      <div style={styles.container}>
        {children}
      </div>
    );
  }
  
  const styles = {
    container: {
      textAlign: 'center',
      marginTop: '24px',
    },
  };