import { useState,useEffect,useRef } from "react";
import { TextField as Input } from '@mui/material'
import { Otsikko, Error, Button } from "../components/Styles";
import { useForm } from "react-hook-form";

import { csrfFetch,uusisalasanaFetch } from "../yhteydet"

const Uusisalasana =  () => {
  const [ilmoitus, setIlmoitus] = useState({});
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

  console.log('Uusisalasana,csrfToken:',csrfToken.current)
 
  const setErrors = errors => {
    for (let kentta in errors) {
      console.log(`setErrors, ${kentta}:${errors[kentta]}`)
      setError(kentta,{type:"palvelinvirhe",message:errors[kentta]})
      }
    }  

  const clearError = event => { 
    const field = event.target.name
    if (errors[field]?.type === 'palvelinvirhe') clearErrors(field)
    }

  const uusisalasana = data => {
      console.log("uusisalasana,csfrToken:",csrfToken.current)    
      console.log("uusisalasana,data:",data)
      uusisalasanaFetch(data,csrfToken.current)
      .then(dataObj => {
        //const dataObj = JSON.parse(data)
        console.log(`uusisalasana,response data:`,dataObj)
        if (dataObj.ok) {
          if (dataObj.message){
            console.log('dataObj:',dataObj)
            setIlmoitus(dataObj)
            }
          } 
        else {
          if (dataObj.virhe?.includes('csrf'))
            setError('email',{type: "palvelinvirhe"})
          else if (dataObj.virhe)
            setError('email',{type: "palvelinvirhe",message:dataObj.virhe}) 
          else if (dataObj.errors)
            setErrors(dataObj.errors)
          }})
      .catch(e => {
        //e: TypeError: Failed to fetch
        console.error('uusisalasana:',String(e))
        setError('apiError',{ message:String(e) })
      })
  }

  if (ilmoitus.ok && ilmoitus.message) return (
    <div>
    <h2>Salasanan uusimislinkki on lähetty.</h2>
    <p>{ilmoitus.message}</p>
    </div>
    )
    
  if (ilmoitus.ok === 'Virhe') return (
    <div>
    <h2>Salasanan uusimislinkin lähettäminen epäonnistui.</h2>
    <p>{ilmoitus.message}</p>
     </div>
    )    

  return (
    <>
      <Otsikko>Salasanan uusiminen</Otsikko>
      {/* Huom. handleSubmit ei välttämättä toimi jos form on Form-komponentti */}
      <form onSubmit={handleSubmit(uusisalasana)} style={{ maxWidth: '600px' }}>
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

      <Button type="submit" variant="outlined">
      Lähetä salasanan uusimislinkki
      </Button>
      </form>
     </>
  )
}

export default Uusisalasana