// src/components/AuthDebug.tsx
import { useEffect, useState } from 'react';

export function AuthDebug() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  
  useEffect(() => {
    function checkAuth() {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      setToken(storedToken);
      
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing user data');
        }
      }
    }
    
    // Check immediately
    checkAuth();
    
    // Also check every second
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed bottom-2 left-2 p-2 bg-black/80 text-white text-xs rounded max-w-xs z-50">
      <div><strong>Auth Debug:</strong></div>
      <div>Token: {token ? `✅ ${token.substring(0, 10)}...` : '❌ Missing'}</div>
      <div>User: {user ? '✅ ' + (user.username || user.email) : '❌ Missing'}</div>
      <div>Path: {window.location.pathname}</div>
      <button 
        className="bg-red-500 px-2 py-1 rounded mt-1"
        onClick={() => {
          console.log('Full token:', localStorage.getItem('token'));
          console.log('Full user:', localStorage.getItem('user'));
        }}
      >
        Log Full Details
      </button>
    </div>
  );
}