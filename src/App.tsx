import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { useAuthStore } from './stores/authStore';
import { useEffect } from 'react';

function App() {
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    initialize();  // вызываем инициализацию при загрузке
  }, []);

  // Пока не инициализировались, показываем спиннер
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#23A6F0]"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;