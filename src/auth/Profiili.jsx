import { useForm } from "react-hook-form"
import { Error, Button } from '../components/Styles'
import { TextField as Input } from '@mui/material'
import { useAuth } from "./Auth";
import { csrfUrl, urlRestapi, useFormSubmit, clearFormErrors, useGetUser } from '../yhteydet'
/*
sähköpostiosoite, käyttäjätunnus 
*/
const Profiili = () => {
  const url = urlRestapi + '/profiili'
  const getUrl = urlRestapi + '/user'
  const { authTokens } = useAuth()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    reset,
    formState: { errors } } = useForm()

  const { 
    submitData, 
    isLoading, 
    data,
    successMessage,
    setSuccessMessage } = useFormSubmit({url, authTokens, csrfUrl, setError})
  
  const { userLoading } = useGetUser({url:getUrl, authTokens, setError, reset})

  const clearError = event => {
    clearFormErrors(event,errors,clearErrors,setSuccessMessage)
    }

  console.log('Profiili,data:',data)  
  return (
    <>
    <h1>Profiili</h1>
    {userLoading && <p>Profiilitietojen haku on käynnissä...</p>}
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
      {...register("username", { required: true,pattern:/^[A-Za-z][A-Za-z0-9_.]*$/i  })}
      onInput={clearError}
      />
      {errors.username?.type === 'required' && <Error>Anna käyttäjätunnus</Error>}
      {errors.username?.type === 'pattern'  && <Error>Virheellinen käyttäjätunnus</Error>}
      {errors.username?.type === 'palvelinvirhe' && <Error>{errors.username.message}</Error>} 

    <Input  
      label="Paikkakunta"
      variant="outlined"
      margin="normal"
      fullWidth
      InputLabelProps={{ shrink: true }} 
      {...register("location", { maxLength:{ value: 64} })}
      onInput={clearError}
      />
    {errors.location?.type === 'maxLength'  && <Error>Virheellinen paikkakunta</Error>}
  
    <Input 
      multiline
      rows={4} // Set the number of rows   
      label="Tietoa minusta"
      variant="outlined"
      margin="normal"
      fullWidth
      InputLabelProps={{ shrink: true }} 
      {...register("about_me")}
      onInput={clearError}
      />
    {errors.otherError && <Error>{errors.otherError.message}</Error>}

  {successMessage && <p>{successMessage}</p>}
  <Button type="submit" variant="outlined">
  Tallenna
  </Button>
  </form>
  </>
  )
}

export default Profiili