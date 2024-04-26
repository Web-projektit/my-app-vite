import { useState,useEffect } from 'react';
import { useForm } from "react-hook-form"
import { Error } from '../components/Styles'
import { Button,FormControlLabel as Label,TextField as Input, Checkbox } from '@mui/material'
import { getNotes } from '../yhteydet';
import Note from '../components/Note'

const Notes = () => {
const [notes, setNotes] = useState([])
const {register,handleSubmit,formState:{ errors }} = useForm()


useEffect(() => {
  getNotes().then(notes => {
    console.log('notes, useEffect:',notes)
    setNotes(notes)
    })    
  }, []);


const onSubmit = data => {
  let newNote = {...data,id: notes.length + 1}
  setNotes(notes.concat(newNote))
  console.log(newNote)
  }

console.log('notes:',notes)    
return (
<div>
    <h1>Notes</h1>
    <p>Here you can find all the notes</p>
    <ul>
    { notes.map(note => <Note key={note.id} note={note}/>) }
    </ul>  

<form onSubmit={handleSubmit(onSubmit)}>
<Input 
  label="Ohjelmointivihje"
  variant="outlined"
  margin="normal"
  fullWidth
  InputLabelProps={{ shrink: true }}
  defaultValue="Ohjelmointivihje" 
  {...register("content",{required:true})} 
/>  
{errors.content && <Error>Anna ohjelmointivihje</Error>}

<Label 
control={<Checkbox defaultChecked />} label="Tärkeä" 
{...register("important")}
/>

<Button 
  type="submit" 
  variant="outlined"
  style={{ display:'block',marginTop: 10, marginLeft: 'auto',marginRight: 40}}
  >Lisää
</Button>
</form>
</div>
)
}


export default Notes;