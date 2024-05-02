import { useForm } from "react-hook-form"
import { Error } from '../components/Styles'
import { Button, TextField as Input } from '@mui/material'
//import { Label } from 'reactstrap'

const Rekisterointi = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = data => console.log(data)
  console.log(watch("email")) // watch input value by passing the name of it

  return (
    <>
    <h1>Rekisteröityminen</h1>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input 
       label="Sähköpostiosoite"
       variant="outlined"
       margin="normal"
       fullWidth
       //style={{ marginTop:40, display: 'block' }}
       InputLabelProps={{ shrink: true }}
       //defaultValue="test" 
       {...register("email", { required: true,pattern:/^[A-Za-z]+$/i  })}/>
  
       {errors.email?.type === 'required' && <Error>Anna sähköpostiosoite</Error>}
       {errors.email?.type === 'pattern'  && <Error>Virheellinen sähköpostiosoite</Error>}
     

      <Input         
        label="Käyttäjätunnus"
        variant="outlined"
        margin="normal"
        fullWidth
        //style={{ marginTop:40, display: 'block' }}
        InputLabelProps={{ shrink: true }} 
        {...register("username", { required: true,pattern:/^[A-Za-z]+$/i  })}/>
  
      {errors.username?.type === 'required' && <Error>Anna käyttäjätunnus</Error>}
      {errors.username?.type === 'pattern'  && <Error>Virheellinen käyttäjätunnus</Error>}
    
      <Input         
        label="Salasana"
        variant="outlined"
        margin="normal"
        fullWidth
        //style={{ marginTop:40, display: 'block' }}
        InputLabelProps={{ shrink: true }} 
        {...register("password", { required: true,pattern:/^[A-Za-z]+$/i  })}/>
  
      {errors.password?.type === 'required' && <Error>Anna salasana</Error>}
      {errors.password?.type === 'pattern'  && <Error>Virheellinen salasana</Error>}

      <Input         
        label="Salasana uudestaan"
        variant="outlined"
        margin="normal"
        fullWidth
        //style={{ marginTop:40, display: 'block' }}
        InputLabelProps={{ shrink: true }} 
        {...register("password2", { required: true,pattern:/^[A-Za-z]+$/i  })}/>
  
      {errors.password2?.type === 'required' && <Error>Anna salasana uudestaan</Error>}
      {errors.password2?.type === 'pattern'  && <Error>Salasanat eivät täsmää</Error>}

   <Button 
   type="submit" 
   variant="outlined"
   //style={{ marginTop: 80 }}
   >Tallenna</Button>
   </form>
  </>
  )
}

export default Rekisterointi