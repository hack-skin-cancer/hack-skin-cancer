import { BrowserRouter, Routes, Route } from "react-router-dom";
import WelcomeScreen from "./components/screens/welcomescreen/WelcomeScreen";
import InputScreen from "./components/screens/inputscreen/InputScreen";
import OutputScreen from "./components/screens/outputscreen/OutputScreen";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/input" element={<InputScreen />} />
        <Route path="/output" element={<OutputScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
