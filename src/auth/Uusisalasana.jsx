import { TextField as Input } from '@mui/material'
import { Otsikko, Error, Button } from "../components/Styles";
import { useForm } from "react-hook-form";
import { csrfUrl, uusisalasanaUrl, useFormSubmit, clearFormErrors } from '../yhteydet'

const Uusisalasana =  () => {
  const { 
    register, 
    handleSubmit, 
    setError, 
    clearErrors, 
    formState: { errors } } = useForm()
  const { 
    submitData, 
    isLoading, 
    data } = useFormSubmit({url:uusisalasanaUrl, csrfUrl, setError})
  const clearError = event => clearFormErrors(event,errors,clearErrors)
      
  if (data?.status === 'ok') return (
    <div>
    <h2>Salasanan uusimislinkki on lähetty.</h2>
    <p>{data.message}</p>
    </div>
    )
    
  else if (data?.status === 'virhe') return (
    <div>
    <h2>Salasanan uusimislinkin lähettäminen epäonnistui.</h2>
    <p>{data.message}</p>
     </div>
    )    

  return (
    <>
      <Otsikko>Salasanan uusiminen</Otsikko>
      {/* Huom. handleSubmit ei välttämättä toimi jos form on Form-komponentti */}
      <form onSubmit={handleSubmit(submitData)} style={{ maxWidth: '600px' }}>
      {isLoading && <p>Salasanaa uusitaan...</p>}
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
      {errors.otherError && <Error>{errors.otherError.message}</Error>}  
       <Button type="submit" variant="outlined">
      Lähetä salasanan uusimislinkki
      </Button>
      </form>
     </>
  )
}

export default Uusisalasana