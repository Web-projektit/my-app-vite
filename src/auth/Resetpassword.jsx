import { useRef } from "react";
import { Link } from "react-router-dom";
import { TextField as Input } from '@mui/material'
import { Otsikko, Error, Button } from "../components/Styles";
import { useForm } from "react-hook-form";
import { csrfUrl,resetPasswordUrl,useFormSubmit } from "../yhteydet"

const Resetpassword = () => {
  const { register, handleSubmit, setError, clearErrors, watch, formState: { errors } } = useForm();
  const password = useRef({});
  password.current = watch("password", "");
    
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

  const { submitData, isLoading, error, data } = useFormSubmit(resetPasswordUrl,csrfUrl)
  console.log("Resetpassword,isLoading:",isLoading,"error:",error,"data:",data)

  if (error) {
    setError('apiError',{ message:error })
    }
  
  else if (data?.status === 'ok' && data.message) {
    return (
      <div>
      <h2>Salasanan uusiminen onnistui.</h2>
      <p>{data.message}</p>
      <Link to="/kirjautuminen">Kirjaudu palveluun</Link>
      </div>
      )
    }

  else if (data?.status === 'virhe' && data.message.includes('csrf')) {
    console.error("csrf-virhe,message:",data.message)
    setError('password2',{type: "palvelinvirhe",message:data.message })
    }

  else if (data?.status === 'virhe' && data.errors){
      console.error('data.errors:',data.errors)
      setErrors(data.errors)
      }

  else if (data?.status === 'virhe') {  
        console.error('data.message:',data.message)
        setError('password2',{type: "tunnusvirhe",message: data.message})
      }
  
  
  /*
  const uusisalasana = data => {
      console.log("uusisalasana,csfrToken:",csrfToken.current)    
      console.log("uusisalasana,data:",data)
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token')  
      resetPasswordFetch(data,csrfToken.current,token)
      .then( data => {
        //const dataObj = JSON.parse(data)
        console.log(`uusisalasana,response data:`,data)
        if (data.status === 'ok') {
            setIlmoitus(data)
            } 
        else {  
          //const dataObj = JSON.parse(dataObj)
          console.error("data:",data)
           if (data.message?.includes('csrf')){
            console.error("csrf-virhe,message:",data.message)
            setError('password2',{type: "palvelinvirhe",message:'csfr-virhe' })
            }
          else if (data.errors){
            console.error('data.errors:',data.errors)
            setErrors(data.errors)
            }
          else {  
            console.error('data.message:',data.message)
            setError('password2',{type: "tunnusvirhe",message: data.message})
          }
        }})
      .catch(e => {setError('apiError',{ message:e })})
    }
    */
  const uusisalasana = data => submitData(data)
       
  return (
    <>
      {data?.status == 'virhe' && <Error>{data.message}</Error>}
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
    <Button type="submit" variant="outlined" disabled={isLoading}>
      Tallenna salasana
    </Button>
    </form>
    </>
  )
}

export default Resetpassword