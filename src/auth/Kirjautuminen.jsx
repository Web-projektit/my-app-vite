import { useState,useEffect,useRef } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
// import axios from 'axios';
// import logoImg from "../img/omnia_logo.png";
import { Button, TextField as Input } from '@mui/material'
import { Otsikko, Error } from "../components/Styles";
import { useForm } from "react-hook-form";
import { useAuth } from "./Auth";
import { csrfFetch,loginFetch } from "../yhteydet"

const Kirjautuminen =  () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [ilmoitus, setIlmoitus] = useState({});
  const { setAuthTokens,setAuthConfirm } = useAuth();
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
 
  const csrfToken = useRef('');
    
  useEffect(() => {
    console.log(`useEffect`)
    csrfFetch()
    .then(response => {
      //response.headers.forEach((v,i) => console.log(i));
      console.log(...response.headers);
      csrfToken.current = response.headers.get("X-CSRFToken");
    })
    .catch(err => {
      console.log(err);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  console.log('Kirjautuminen,csrfToken:',csrfToken.current)

  const clearError = event => { 
    const field = event.target.name
    if (errors[field]?.type === 'palvelinvirhe') clearErrors(field)
    }

  const kirjautuminen = data => {
      console.log("kirjautuminen,csfrToken:",csrfToken.current)    
      console.log("kirjautuminen,data:",data)
      // const formData = new FormData();
      // Object.keys(data).forEach(key => formData.append(key, data[key]));
      const searchParams = new URLSearchParams(window.location.search)
      const next = searchParams.get('next','') 
      loginFetch(data,csrfToken.current,next)
      .then(data => {
        const dataObj = JSON.parse(data)
        console.log(`kirjautuminen,response data:`,dataObj)
        if (dataObj.ok) {
          setAuthTokens('OK');
          setLoggedIn(true);
          /* Huom. Tässä ylläpidetään käyttäjän vahvistustilaa. */
          if (dataObj.confirmed) setAuthConfirm('CONFIRMED')
          else setAuthConfirm()  
          if (!!next && dataObj.message){
            console.log("next:",next,"dataObj:",dataObj)
            // setAuthConfirm('CONFIRMED')
            setIlmoitus(dataObj)
            }
          } 
        else {
          if (dataObj.virhe?.includes('csrf'))
            setError('password',{type: "palvelinvirhe"})
          else 
            setError('password',{type: "tunnusvirhe",message: dataObj.virhe})
          }})
      .catch(e => {
        //e: TypeError: Failed to fetch
        console.error('fetchLogin,e:',String(e))
        setError('apiError',{ message:String(e) })
      })
  }

 
  /*
  function axiosLogin(data) {
      axios.post("http://localhost:5000/reactapi/signin",data).then(result => {
      console.log(`result.status:${result.status}`)
      if (result.status === 200 && result.data === 'OK') {
        console.log('post result:',result.data)
        setAuthTokens(result.data);
        setLoggedIn(true);
      } else {
          setError(
          'password',
          {type: "palvelinvirhe"}
          )
      }
    }).catch(e => {setError('apiError',{ message:e })})
  }
  */
  const { state } = useLocation()
  console.log(`Login,message:${ilmoitus.message},loggedIn:${loggedIn}`)
  if (loggedIn && !ilmoitus.message) {
    const referer = state?.location.pathname || '/' 
    const search = state?.location.search || '' 
    const to = `${referer}${search}`
    console.log(`Login,to:${to},state:`,state)
    return <Navigate to={to} replace={true} />
  }

  if (ilmoitus.ok === 'OK' && ilmoitus.message) return (
    <div>
    <h2>Rekisteröityminen onnistui.</h2>
    <p>{ilmoitus.message}</p>
    </div>
    )

  /* Huom. Tässä tarvitaan joko painike tai ohjaus vahvistussivulle */  
  if (ilmoitus.ok === 'Virhe') return (
    <div>
    <h2>Sähköpostiosoitteen vahvistaminen epäonnistui.</h2>
    <p>{ilmoitus.message}</p>
    <Link to="/confirm">Voit pyytää uutta sähköpostiosoitteesi vahvistusviestiä tästä.</Link>
    </div>
    )    

  return (
    <>
      {/*<Logo src={logoImg} />*/}
      <Otsikko>Kirjautuminen</Otsikko>
      {/* Huom. handleSubmit ei välttämättä toimi jos form on Form-komponentti */}
      <form onSubmit={handleSubmit(kirjautuminen)}>
      {errors.apiError && <Error>{errors.apiError.message}</Error>}  
      <Input 
      label="Sähköpostiosoite"
      variant="outlined"
      margin="normal"
      fullWidth
      InputLabelProps={{ shrink: true }}
      {...register("email", { required: true,pattern:/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i})}
      onInput={clearError}
      />
      {errors.email?.type === 'required' && <Error>Anna sähköpostiosoite</Error>}
      {errors.email?.type === 'pattern'  && <Error>Virheellinen sähköpostiosoite</Error>}
      {errors.email?.type === 'palvelinvirhe' && <Error>{errors.email.message}</Error>} 

      <Input  
      type="password"        
      label="Salasana"
      variant="outlined"
      margin="normal"
      fullWidth
      InputLabelProps={{ shrink: true }} 
      {...register("password", { required: true,pattern:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/  })}
      onInput={clearError}
      />
      {errors.password?.type === 'required' && <Error>Anna salasana</Error>}
      {errors.password?.type === 'pattern'  && <Error>Virheellinen salasana</Error>}
      {errors.password?.type === 'tunnusvirhe' && <Error>{errors.password.message}</Error>} 
      {errors.password?.type === 'palvelinvirhe' && <Error>{errors.password.message}</Error>} 
      <Button type="submit" variant="outlined"
      >Kirjaudu
      </Button>
     
      </form>
      <br></br>
      <Link to="/rekisterointi">Et ole rekisteröitynyt vielä?</Link>    
  </>
  )
}

export default Kirjautuminen