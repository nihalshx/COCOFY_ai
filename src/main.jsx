import { createRoot } from 'react-dom/client';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import { MobileBar, Nav } from './components/Chrome.jsx';
import Assistant from './components/Assistant.jsx';
import Home from './pages/Home.jsx';
import Legal from './pages/Legal.jsx';
import { startLenis } from './lib/motion.js';
import './styles.css';

// The shareable preview runs from a relative path, so it uses an in-memory router.
const Router = import.meta.env.VITE_PREVIEW ? MemoryRouter : BrowserRouter;

startLenis();

function App() {
  return (
    <Router>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Legal page="privacy" />} />
        <Route path="/terms" element={<Legal page="terms" />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <MobileBar />
      <Assistant />
    </Router>
  );
}

createRoot(document.getElementById('root')).render(<App />);
