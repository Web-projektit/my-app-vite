import { useState,useEffect,useRef } from "react";
import { Link,useLocation } from "react-router-dom";
import { TextField as Input } from '@mui/material'
import { Otsikko, Error, Button } from "../components/Styles";
import { useForm } from "react-hook-form";
import { csrfFetch,resetPasswordFetch } from "../yhteydet"

const Resetpassword = () => {
  const [ilmoitus, setIlmoitus] = useState({});
  const { register, handleSubmit, setError, clearErrors, watch, formState: { errors } } = useForm();
  const location = useLocation();
  const password = useRef({});
  password.current = watch("password", "");
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

  console.log('Resetpassword,csrfToken:',csrfToken.current)
  
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
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token')  
      resetPasswordFetch(data,csrfToken.current,token)
      .then(dataObj => {
        //const dataObj = JSON.parse(data)
        console.log(`uusisalasana,response dataObj:`,dataObj)
        if (dataObj.ok) {
            setIlmoitus(dataObj)
            } 
        else {  
          //const dataObj = JSON.parse(dataObj)
          console.log("dataObj:",dataObj)
          /* Huom. Palvelinvirheissä on virhe:, lomakkeen validointivirheissä ei.*/
          if (dataObj.virhe?.includes('csrf')){
            console.error("csrf-virhe,message:",dataObj.virhe)
            setError('password2',{type: "palvelinvirhe",message:'csfr-virhe' })
            }
          else if (dataObj.errors){
            //setError('password2',{type: "tunnusvirhe",message:'Tunnukset ovat jo käytössä'})
            console.error('dataObj.errors:',dataObj.errors)
            setErrors(dataObj.errors)
            }
          else {  
            console.error('dataObj.virhe,message:',dataObj.virhe)
            setError('password2',{type: "tunnusvirhe",message: dataObj.virhe})
          }
        }})
      .catch(e => {setError('apiError',{ message:e })})
    }
  

  if (ilmoitus.ok && ilmoitus.message) {
    return (
    <div>
    <h2>Salasanan uusiminen onnistui.</h2>
    <p>{ilmoitus.message}</p>
    <Link to="/kirjautuminen">Kirjaudu palveluun</Link>
    </div>
    )
    }
    
  return (
    <>
      {ilmoitus?.virhe && <Error>{ilmoitus.message}</Error>}
      <Otsikko>Salasanan uusiminen</Otsikko>
      {/* Huom. handleSubmit ei välttämättä toimi jos form on Form-komponentti */}
      <form onSubmit={handleSubmit(uusisalasana)} style={{ maxWidth: '600px' }}>
      {errors.apiError && <Error>{errors.apiError.message}</Error>}  
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
  
    <Input    
      type="password"      
      label="Salasana uudestaan"
      variant="outlined"
      margin="normal"
      fullWidth
      InputLabelProps={{ shrink: true }} 
      {...register("password2", { 
        required: true,
        pattern:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        validate: value => value === password.current 
        })}
      onInput={clearError}
      />
      {errors.password2?.type === 'required' && <Error>Anna salasana</Error>}
      {errors.password2?.type === 'pattern'  && <Error>Virheellinen salasana</Error>}
      {errors.password2?.type === 'validate' && <Error>Salasanat eivät täsmää</Error>}
      {errors.password2?.type === 'tunnusvirhe' && <Error>{errors.password2.message}</Error>} 
      {/* Huom. salasanan validointi palvelimella password-kentälle. */}
      {errors.password?.type === 'palvelinvirhe' && <Error>{errors.password.message}</Error>} 
    <Button type="submit" variant="outlined">
      Tallenna salasana
    </Button>
    </form>
    </>
  )
}

export default Resetpassword