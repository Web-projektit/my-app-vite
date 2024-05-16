import { useRef } from "react";
import { Link,useLocation } from "react-router-dom";
import { TextField as Input } from '@mui/material'
import { Otsikko, Error, Button } from "../components/Styles";
import { useForm } from "react-hook-form";
import { csrfUrl,resetPasswordUrl,useFormSubmit } from "../yhteydet"

const Resetpassword = () => {
  const { register, handleSubmit, setError, clearErrors, watch, formState: { errors } } = useForm();
  const password = useRef({});
  password.current = watch("password", "");
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const resetToken = queryParams.get('token');
  const resetUrl = resetPasswordUrl+'/'+resetToken
 
  const { submitData, isLoading, data } = useFormSubmit({url:resetUrl, fetchCsrfUrl:csrfUrl, setError})
  
  const clearError = event => { 
    const field = event.target.name
    if (errors[field]?.type === 'palvelinvirhe') clearErrors(field)
    }

  //const { submitData, isLoading, error, data } = useFormSubmit(resetUrl,csrfUrl)
  console.log("Resetpassword,response data:",data)
  if (data?.status === 'ok' && data.message) {
    return (
      <div>
      <h2>Salasanan uusiminen onnistui.</h2>
      <p>{data.message}</p>
      <Link to="/kirjautuminen">Kirjaudu palveluun</Link>
      </div>
      )
    }

  return (
    <>
      {/*data?.status == 'virhe' && <Error>{data.message}</Error>*/}
      <Otsikko>Salasanan uusiminen</Otsikko>
      {/* Huom. handleSubmit ei välttämättä toimi jos form on Form-komponentti */}
      <form onSubmit={handleSubmit(submitData)} style={{ maxWidth: '600px' }}>
      {isLoading && <p>Tallennus käynnissä...</p>}  
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