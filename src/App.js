import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Home from "./pages/Home";
import Reward from "./pages/Reward";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/LogIn" element={<LogIn />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Reward" element={<Reward />} />
      </Routes>
    </Router>
  );
}

export default App;
