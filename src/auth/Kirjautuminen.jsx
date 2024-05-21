import { useEffect } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { TextField as Input } from '@mui/material'
import { Otsikko, Error, Button } from "../components/Styles";
import { useForm } from "react-hook-form";
import { useAuth } from "./Auth";
import { csrfUrl, loginUrl, useFormSubmit, clearFormErrors } from "../yhteydet"

const Kirjautuminen =  () => {
  /* Huom. Tässä next-parametria ei lisätä url:iin, koska
  siirtymistä ei tehdä palvelimella, vaan täältä suoraan.
  let url = next ? loginUrl+'?next='+next : loginUrl 
  */
  const { setAuthTokens,setAuthConfirm } = useAuth();
  const { 
    register, 
    handleSubmit, 
    setError, 
    clearErrors, 
    formState: { errors } } = useForm();
  const { 
    submitData, 
    isLoading, 
    data } = useFormSubmit({url:loginUrl, csrfUrl, setError})
  
  const location = useLocation()
  const state = location.state
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status');
  const message = queryParams.get('message');
  
  const clearError = event => clearFormErrors(event,errors,clearErrors)
  
  useEffect(() => {
    /* Huom. Kontekstin arvon muuttaminen johtaa myös
       App-komponentin uudelleenrenderöintiin, ja nykyisen
       komponentin renderöinnin tulee olla ensin valmis.*/
    if (data?.status === 'ok') {
      const confirm = data.confirmed ? 'CONFIRMED' : null
      setAuthTokens(data.token);
      /* Huom. Tässä ylläpidetään käyttäjän vahvistustilaa. */
      setAuthConfirm(confirm)
      }}, [data,setAuthTokens,setAuthConfirm]); 

  if (data?.status === 'ok') {
    const referer = state?.location.pathname || '/' 
    const search = state?.location.search || '' 
    const to = `${referer}${search}`
    console.log(`Login,to:${to},state:`,state)
    return <Navigate to={to} replace={true}/>
    }

  return (
    <>
      {/*<Logo src={logoImg} />*/}
      {state?.location.pathname === '/unconfirmed' && <p>Kirjaudu ensin</p>}
      {isLoading && <p>Kirjaudutaan...</p>}
      {status === 'virhe' && <Error>{message}</Error>}
      {status === 'ok' && <p>{message}</p>}
      <Otsikko>Kirjautuminen</Otsikko>
      {/* Huom. handleSubmit ei välttämättä toimi jos form on Form-komponentti */}
      <form onSubmit={handleSubmit(submitData)} style={{ maxWidth: '600px' }}>
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
      {errors.otherError && <Error>{errors.otherError.message}</Error>}
   
      <Button type="submit" variant="outlined">
      Kirjaudu
      </Button>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Link to="/uusisalasana">Unohtuiko salasana?</Link>      
      <Link to="/rekisterointi">Et ole rekisteröitynyt vielä?</Link>    
      </div>
  </>
  )
}

export default Kirjautuminen