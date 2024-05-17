import { useRef, useState } from 'react'
import { useForm } from "react-hook-form"
import { Error, Button } from '../components/Styles'
import { TextField as Input } from '@mui/material'
import { csrfUrl, signupUrl, useFormSubmit, clearFormErrors } from '../yhteydet'

const Rekisterointi = () => {
  const [signedUp, setSignedUp] = useState(false)
  const password = useRef({});

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors } } = useForm()

  const { 
    submitData, 
    isLoading, 
    data } = useFormSubmit({url:signupUrl, csrfUrl, setError})
  
  const clearError = event => clearFormErrors(event,errors,clearErrors)

  password.current = watch("password", "");  
  console.log(`Rekisterointi,signedUp:${signedUp}`)

  if (data?.status === 'ok') {
    setSignedUp(true)
    } 

  return (
    <>
    <h1>Rekisteröityminen</h1>
    {isLoading && <p>Tallennus on käynnissä...</p>}
    {errors.apiError && <Error>{errors.apiError.message}</Error>}  
    <form onSubmit={handleSubmit(submitData)}>
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
      label="Käyttäjätunnus"
      variant="outlined"
      margin="normal"
      fullWidth
      InputLabelProps={{ shrink: true }} 
      {...register("username", { required: true,pattern:/^[A-Za-z]+$/i  })}
      onInput={clearError}
      />
      {errors.username?.type === 'required' && <Error>Anna käyttäjätunnus</Error>}
      {errors.username?.type === 'pattern'  && <Error>Virheellinen käyttäjätunnus</Error>}
      {errors.username?.type === 'palvelinvirhe' && <Error>{errors.username.message}</Error>} 

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
        //validate: value => value === password.current 
        })}
      onInput={clearError}
      />
      {errors.password2?.type === 'required' && <Error>Anna salasana</Error>}
      {errors.password2?.type === 'validate' && <Error>Salasanat eivät täsmää</Error>}
      {errors.password2?.type === 'tunnusvirhe' && <Error>{errors.password2.message}</Error>} 
      {/* Huom. salasanan validointi palvelimella password-kentälle. */}
      {errors.password?.type === 'palvelinvirhe' && <Error>{errors.password.message}</Error>} 
      {errors.otherError && <Error>{errors.otherError.message}</Error>}

  <Button type="submit" variant="outlined">
  Rekisteröidy
  </Button>
  </form>
  </>
  )
}

export default Rekisterointi