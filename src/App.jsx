import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TaxiProvider } from './context/TaxiContext';
import RoleSelection from './screens/RoleSelection';
import DriverScreen from './screens/DriverScreen';
import AdminScreen from './screens/AdminScreen';
import './App.css';

function App() {
  return (
    <TaxiProvider>
      <Router>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
          <Route path="/driver" element={<DriverScreen />} />
          <Route path="/admin" element={<AdminScreen />} />
        </Routes>
      </Router>
      <style>{`
        .fade-in {
          animation: fadeIn 0.4s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </TaxiProvider>
  );
}

export default App;
