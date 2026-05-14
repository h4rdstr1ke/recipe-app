import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import GlobalTimerAlarm from './components/alarm/GlobalTimerAlarm';

function App() {
  return (
    <BrowserRouter>
      <GlobalTimerAlarm />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;