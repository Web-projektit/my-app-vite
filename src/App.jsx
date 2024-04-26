import { Routes, Route } from "react-router-dom";
import Lomake from "./pages/Lomake";
import Notes from "./pages/Notes";
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
        <Route exact path="/" element={<Notes/>} />
        <Route path="/lomake" element={<Lomake/>} />
        <Route path="/notes" element={<Notes/>} />
    </Routes>
    </div>
    <Footer/>
    </>
  )
}

export default App