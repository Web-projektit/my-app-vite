import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { AuthContext } from "./auth/Auth";
import Private from "./auth/PrivateRoute";
import Lomake from "./pages/Lomake";
import Notes from "./pages/Notes";
import Muistiinpano from "./pages/Muistiinpano";
import Confirm from "./auth/Confirm";
import Confirmed from "./auth/Confirmed";
import Unconfirmed from "./auth/Unconfirmed";
import Rekisterointi from "./auth/Rekisterointi";
import Kirjautuminen from "./auth/Kirjautuminen";
import Uusisalasana from "./auth/Uusisalasana";
import Resetpassword from "./auth/Resetpassword";
import Etusivu from "./pages/Etusivu";
import { NavbarReactstrap as Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { closeFetch } from "./yhteydet";
import 'bootstrap/dist/css/bootstrap.min.css';
import './site.css'

const App = () => {
  const [authTokens, setAuthTokens] = useState(sessionStorage.getItem('tokens'));
  const [authConfirm, setAuthConfirm] = useState(localStorage.getItem('confirm'));
  /* Tyhjennetään state poistuttessa */
  let navigate = useNavigate()
 
  const setTokens = data => {
    console.log('setTokens:',data)
      /* Huom. logout kutsuu setTokens-funktiota ilman dataa,
         jolloin authTokens-alkuarvoksi tulisi merkkijono 'undefined'. 
         Tässä removeItem tuottaa authTokens-alkuarvoksi null,
         jolloin sen boolean arvo on oikein false. */
      if (data) sessionStorage.setItem("tokens", JSON.stringify(data));
      else {
        //axios.get(closeUrl,{withCredentials:true});
        //fetch(closeUrl,{credentials:'include'})
        closeFetch(authTokens);
        sessionStorage.removeItem("tokens");
        /* 
        Pyritää estetään kirjautuminen samalle sivulle, jolta poistuttiin
        tyhjentämällä react-router-domin useLocation state. Samoin
        myös Kirjaudu-painikkeen yhteydessä. 
        */  
        navigate('/',{})  
        }   
      setAuthTokens(data);
      }

     
  const setConfirm = data => {
    console.log('setConfirm:',data)
    if (data) localStorage.setItem("confirm", JSON.stringify(data));
    else localStorage.removeItem("confirm");  
    setAuthConfirm(data);
    }
  
  console.log('rendering App')
  

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens, authConfirm, setAuthConfirm: setConfirm }}>
    <Navbar/>
    <div className="container">
    <Routes>
        <Route exact path="/" element={<Etusivu/>} />
        <Route path="/lomake" element={<Lomake/>} />
        <Route path="/notes" element={<Private><Notes/></Private>} />
        <Route path="/notes/:id" element={<Muistiinpano/>} />
        <Route path="/rekisterointi/" element={<Rekisterointi/>} />
        <Route path="/kirjautuminen/" element={<Kirjautuminen/>} />
        <Route path="/confirmed" element={<Confirmed/>}/>
        <Route path="/uusisalasana" element={<Uusisalasana/>}/>
        <Route path="/reset_password" element={<Resetpassword/>}/>
        <Route path="/confirm" element={<Private><Confirm/></Private>}/>
        <Route path="/unconfirmed" element={<Private><Unconfirmed/></Private>}/>
        <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
    </div>
    <Footer/>
    </AuthContext.Provider>
  )
}

export default App