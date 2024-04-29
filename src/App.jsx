import { Routes, Route } from "react-router-dom";
import Lomake from "./pages/Lomake";
import Notes from "./pages/Notes";
import Muistiinpano from "./pages/Muistiinpano";
import Etusivu from "./pages/Etusivu";
import { NavbarReactstrap as Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import './site.css'

const App = () => {
  console.log('rendering App')
  
  return (
    <>
    <Navbar/>
    <div className="container">
    <Routes>
        <Route exact path="/" element={<Etusivu/>} />
        <Route path="/lomake" element={<Lomake/>} />
        <Route path="/notes" element={<Notes/>} />
        <Route path="/notes/:id" element={<Muistiinpano/>} />
        <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
    </div>
    <Footer/>
    </>
  )
}

export default App