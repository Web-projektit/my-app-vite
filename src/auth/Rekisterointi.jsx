import { useEffect, useRef, useState } from 'react'
import { useForm } from "react-hook-form"
import { Error } from '../components/Styles'
import { Button, TextField as Input } from '@mui/material'
import { csrfFetch, signupUrl } from '../yhteydet'

const Rekisterointi = () => {
  const [signedUp, setSignedUp] = useState(false)
  const [email, setEmail] = useState('')
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm()

  const password = useRef({});
  password.current = watch("password", "");
  const csrfToken = useRef('');
  console.log("Signup renderöidään, signupUrl:",signupUrl)
   
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

console.log('Signup,csrfToken:',csrfToken.current)
console.log(`Signup,signedUp:${signedUp},email:${email}`)

const setErrors = errors => {
  for (let kentta in errors) {
    console.log(`setErrors, ${kentta}:${errors[kentta]}`)
    setError(kentta,{type:"palvelinvirhe",message:errors[kentta]})
    }
  }  
  
  const rekisterointi = data => {
      console.log("fetchSignup,csfrToken:",csrfToken.current)    
      console.log("data:",data)
      const mail = data['email']
      /* 
      const formData = new FormData();
      Object.keys(data).forEach(key => formData.append(key, data[key]));
      */
      fetch(signupUrl,{
        method:'POST',
        headers: {
          "X-CSRFToken": csrfToken.current,
          "Content-Type": "application/json"
          },
        credentials:'include',
        body:JSON.stringify(data)})
      .then(response => response.text())  
      .then(data => {
      console.log(`data palvelimelta ${signupUrl}:${data}`)
      if (data === 'OK') {
        setEmail(mail)
        console.log(`täytetty email:${mail}`)
        setSignedUp(true)
        console.log(`päivittymätön signedUp:${signedUp}`)
        } 
      else {
        const dataObj = JSON.parse(data)
        console.log("dataObj:",dataObj)
        /* Huom. Palvelinvirheissä on virhe:, lomakkeen validointivirheissä ei.*/
        if (dataObj.virhe?.includes('csrf'))
          setError('password2',{type: "palvelinvirhe",message:'csfr-virhe' })
        else 
          //setError('password2',{type: "tunnusvirhe",message:'Tunnukset ovat jo käytössä'})
          setErrors(dataObj.errors)
        }
    }).catch(e => {setError('apiError',{ message:e })})
  }
  

  console.log(watch("email")) // watch input value by passing the name of it

  return (
    <>
    <h1>Rekisteröityminen</h1>
    <form onSubmit={handleSubmit(rekisterointi)}>
      <Input 
       label="Sähköpostiosoite"
       variant="outlined"
       margin="normal"
       fullWidth
       //style={{ marginTop:40, display: 'block' }}
       InputLabelProps={{ shrink: true }}
       //defaultValue="test" 
       {...register("email", { required: true,pattern:/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i})}/>
  
       {errors.email?.type === 'required' && <Error>Anna sähköpostiosoite</Error>}
       {errors.email?.type === 'pattern'  && <Error>Virheellinen sähköpostiosoite</Error>}
       {errors.username?.type === 'palvelinvirhe' && <Error>{errors.email.message}</Error>} 

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
      {errors.username?.type === 'palvelinvirhe' && <Error>{errors.username.message}</Error>} 

      <Input  
        type="password"        
        label="Salasana"
        variant="outlined"
        margin="normal"
        fullWidth
        //style={{ marginTop:40, display: 'block' }}
        InputLabelProps={{ shrink: true }} 
        {...register("password", { required: true,pattern:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/  })}/>
  
      {errors.password?.type === 'required' && <Error>Anna salasana</Error>}
      {errors.password?.type === 'pattern'  && <Error>Virheellinen salasana</Error>}

      <Input    
        type="password"      
        label="Salasana uudestaan"
        variant="outlined"
        margin="normal"
        fullWidth
        //style={{ marginTop:40, display: 'block' }}
        InputLabelProps={{ shrink: true }} 
        {...register("password2", { required: true,pattern:/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/})}/>
  
      {errors.password2?.type === 'required' && <Error>Anna salasana</Error>}
      {errors.password2?.type === 'validate' && <Error>Salasanat eivät täsmää</Error>}
      {errors.password2?.type === 'palvelinvirhe' && <Error>{errors.password2.message}</Error>} 
      {errors.password2?.type === 'tunnusvirhe' && <Error>{errors.password2.message}</Error>} 


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