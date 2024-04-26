import { useForm } from "react-hook-form"
import { Error, Input, Checkbox } from '../components/Styles'
import { Button } from '@mui/material'
import { Label } from 'reactstrap'

export default function Lomake() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const onSubmit = data => console.log(data)
  console.log(watch("example")) // watch input value by passing the name of it

  const {ref:refCheckbox, ...checkbox} = register('checkbox');
  
  return (
    <>
    <h1>React Hook Form</h1>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input 
       label="Description"
       variant="outlined"
       margin="normal"
       fullWidth
       style={{ marginTop:40, display: 'block' }}
       InputLabelProps={{ shrink: true }}
       defaultValue="test" 
       {...register("example")} />

      <Input         
        label="Example Required"
        variant="outlined"
        margin="normal"
        fullWidth
        style={{ marginTop:40, display: 'block' }}
        InputLabelProps={{ shrink: true }} 
        {...register("exampleRequired", { required: true,pattern:/^[A-Za-z]+$/i  })}/>
  
      {errors.exampleRequired?.type === 'required' && <Error>Anna esimerkki</Error>}
      {errors.exampleRequired?.type === 'pattern'  && <Error>Virheellinen esimerkki</Error>}
    
    <Checkbox 
      type="checkbox" 
      innerRef={refCheckbox}
      {...checkbox} 
      />
    <Label check>
      Check me out
    </Label>
   
   <Button 
   type="submit" 
   variant="outlined"
   style={{ marginTop: 80 }}
   >Lisää</Button>
   </form>
  </>
  )
}