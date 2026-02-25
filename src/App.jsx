import Navbar from "./Components/navbar"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Project from "./pages/project"
import SplashCursor from './Components/SplashCursor'; // Sesuaikan path-nya



const App = () => {
  return <div>

  <SplashCursor /> {/* Tambahkan komponen SplashCursor di sini */}    

   <Router>
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
    </Router> 
    
  </div>
}

export default App
