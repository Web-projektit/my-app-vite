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
import Profiili from "./auth/Profiili";
import Uusisalasana from "./auth/Uusisalasana";
import Resetpassword from "./auth/Resetpassword";
import ChangeEmail from "./auth/ChangeEmail";
import Etusivu from "./pages/Etusivu";
import { NavbarReactstrap as Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { closeFetch } from "./yhteydet";
import 'bootstrap/dist/css/bootstrap.min.css';
import './site.css'

const App = () => {
  /*
    Huom. authTokens on json-merkkijono lainausmerkeissä,
    mutta Flaskin httoAuth-autentikointi ei hyväksy lainausmerkkejä 
    Authorization headerissä tokenin ympärillä, joten
    ne täytyy poistaa JSON.parse-metodilla. 
    
    Aikaisemmissa versioissa tämä ei ollut tarpeen, koska authTokens-arvoa
    ei käytetty palvelimen httpAuth-token-autentikointiin, vaan
    ainoastaan React-käyttöliittymän tilan hallintaan Boolean-arvona.   
    React-käyttöliittymän tilan hallintaan käytetään edelleenkin
    vain Boolean-arvoa, mihin authTokens json-merkkijonomuotoisenakin 
    kävisi, mutta nyt se haetaan sessionStoragesta vain App-komponentin 
    renderöinnin alussa.
    */
  const tokens = JSON.parse(sessionStorage.getItem('tokens'))
  const confirm = JSON.parse(localStorage.getItem('confirm'))
  const [authTokens, setAuthTokens] = useState(tokens);
  const [authConfirm, setAuthConfirm] = useState(confirm);
  /* Tyhjennetään state poistuttessa */
  let navigate = useNavigate()
  console.log('Rendering App, authTokens:',authTokens)
 
  const setTokens = data => {
    console.log('setTokens:',data)
      /* Huom. logout kutsuu setTokens-funktiota ilman dataa,
         jolloin authTokens-alkuarvoksi tulisi merkkijono 'undefined'. 
         Tässä removeItem tuottaa authTokens-alkuarvoksi null,
         jolloin sen boolean arvo on oikein false. */
      if (data) {
        sessionStorage.setItem("tokens", JSON.stringify(data));
        console.log('setTokens,authTokens in sessionStorage:',JSON.parse(sessionStorage.getItem('tokens')))
        }
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
        <Route path="/profiili/" element={<Private><Profiili/></Private>} />
        <Route path="/confirmed" element={<Confirmed/>}/>
        <Route path="/uusisalasana" element={<Uusisalasana/>}/>
        <Route path="/reset_password" element={<Resetpassword/>}/>
        <Route path="/confirm" element={<Private><Confirm/></Private>}/>
        <Route path="/unconfirmed" element={<Private><Unconfirmed/></Private>}/>
        <Route path="/vaihdasahkoposti" element={<Private><ChangeEmail/></Private>}/>
        <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
    </div>
    <Footer/>
    </AuthContext.Provider>
  )
}

export default App