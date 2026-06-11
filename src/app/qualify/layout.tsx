export default function QualifyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: 'relative',
      zIndex: 10,
      marginTop: '-52px',
      background: '#ffffff',
      minHeight: '100vh',
    }}>
      {children}
    </div>
  );
}
