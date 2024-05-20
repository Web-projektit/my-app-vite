import { Link } from "react-router-dom";
import { TextField as Input } from '@mui/material'
import { Otsikko, Error, Button } from "../components/Styles";
import { useForm } from "react-hook-form";
import { csrfUrl,changeEmailUrl,useFormSubmit,clearFormErrors } from "../yhteydet"
import { useAuth } from "./Auth";

const ChangeEmail = () => {
  const { authTokens } = useAuth();
  const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
  const { submitData, isLoading, data } = useFormSubmit({url:changeEmailUrl, csrfUrl, authTokens, setError})
  const clearError = event => clearFormErrors(event,errors,clearErrors)

  //const { submitData, isLoading, error, data } = useFormSubmit(resetUrl,csrfUrl)
  console.log("changeEmail,response data:",data)
  if (data?.status === 'ok') {
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
      <Otsikko>Sähköpostiosoitteen vaihtaminen</Otsikko>
      {/* Huom. handleSubmit ei välttämättä toimi jos form on Form-komponentti */}
      <form onSubmit={handleSubmit(submitData)} style={{ maxWidth: '600px' }}>
      {isLoading && <p>Tallennus käynnissä...</p>}  
      {errors.apiError && <Error>{errors.apiError.message}</Error>}  
      
      <Input 
      label="Uusi sähköpostiosoite"
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
      {errors.otherError && <Error>{errors.otherError.message}</Error>}  
    <Button type="submit" variant="outlined" disabled={isLoading}>
    Muuta sähköpostiosoite
    </Button>
    </form>
    </>
  )
}

export default ChangeEmail;