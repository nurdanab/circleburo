import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
// import Header from './components/Header';
import Circle from './services/Circle';
import Semicircle from './services/Semicircle';
import Cycle from './services/Cycle';
import PhoneForm from './components/PhoneForm';
import './i18n'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services/circle" element={<Circle />} />
        <Route path="/services/semicircle" element={<Semicircle />} />
        <Route path="/services/cycle" element={<Cycle />} />
        <Route path="/phone-form" element={<PhoneForm />} />

      </Routes>
    </Router>
  );
}

export default App;
