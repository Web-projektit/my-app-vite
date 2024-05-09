import { useState,useEffect } from 'react';
import { useForm } from "react-hook-form"
import { Error, Button } from '../components/Styles'
import { Dialog, DialogTitle, DialogContent, 
        DialogActions, 
        FormControlLabel as Label,
        Checkbox,TextField as Input } from '@mui/material'
        import { TextareaAutosize as Textarea } from '@mui/base/TextareaAutosize'
        import { getNotes, addNote, updateNote, deleteNote } from '../yhteydet';
import Note from '../components/Note'

const Notes = () => {
const [notes, setNotes] = useState([])
const [open, setOpen] = useState(false);
const [activeNote, setActiveNote] = useState({});

/* f2 = useForm() */
/* Useamman lomakekontekstin määrittely ja kutsu f2.reset(), 
   tai nimeämälä funktio erikseen ja kutsu reset2() */
const {register,handleSubmit,reset,formState:{ errors }} = useForm()
const {
  register:register2,
  handleSubmit:handleSubmit2,
  reset:reset2,
  formState: { errors:errors2 } 
  } = useForm();

const handleClickOpen = clickedNote => {
  setOpen(true);
  setActiveNote(clickedNote)
}

const handleClickConfirm = id => {
  let result = confirm("Haluatko varmasti poistaa muistiinpanon?")
  console.log('handleClickConfirm,id:',id,',result:',result)
  deleteNote(id).then(response => {
    console.log('handleClickConfirm,response:',response)
    setNotes(notes.filter(note => note.id !== id))
    })
  }

const handleClose = () => {
  setOpen(false);
};

useEffect(() => {
  getNotes().then(notes => {
    console.log('notes, useEffect:',notes)
    setNotes(notes)
    })    
  }, []);

useEffect(() => reset2(activeNote)     
/* eslint-disable-next-line react-hooks/exhaustive-deps */
,[activeNote])    
  
const jokeAPI = 'https://v2.jokeapi.dev/joke/Programming'

useEffect(() => {
  fetch(jokeAPI) 
    .then(response => response.json())
    .then(data => {
      console.log('data:',data.joke)
      let teksti = data.joke ? data.joke : 'Ohjelmointivihje'
      reset({'content':teksti})
      
      })
/* eslint-disable-next-line react-hooks/exhaustive-deps */
}, []);


const onSubmit = data => {
  /* Huom. Jos tietokanta kasvaa ohjelman sisällä alusta alkaen, 
     niid maxId:n laskeminen ei ole tarpeen, sillä se on 
     viimeisimmän rivin arvo. */
  const maxId = Math.max(...notes.map(note => Number(note.id)));
  let newNote = {...data,id: (maxId + 1).toString() }
  addNote(newNote).then(responseNote => {
    setNotes(notes.concat(responseNote))   
    console.log('onSubmit,responseNote:',responseNote)
    })
  }

const tallenna = data => {
  updateNote(data)
  .then(response => {
    setNotes(notes.map(note => note.id !== data.id ? note : response.data))
    console.log("tallenna,response.data: ",response.data)
    handleClose()
    })
  }
  
console.log('notes:',notes,'open:',open,'activeNote:',activeNote )    

return (
<div>
    <h1>Ohjelmointivihjeitä</h1>
    <ul style={{ }}>
    { notes.map(note => <Note key={note.id} note={note} handleOpen={handleClickOpen} handleConfirm={handleClickConfirm}/>) }
    </ul>  

<form onSubmit={handleSubmit(onSubmit)}>
<Input
  variant="outlined"
  margin="normal"
  fullwidth="true"
  label="Ohjelmointivihje"
  InputLabelProps={{ shrink: true }}
  autoFocus
  multiline
  rows={4}
  //defaultValue={defaultValue}
  {...register("content",{required:true})} 
  style={{ width: '100%', padding: '4px'}}
/>  
{errors.content && <Error>Anna ohjelmointivihje</Error>}

<Label 
control={<Checkbox defaultChecked />} label="Tärkeä" 
{...register("important")}
/>

<Button 
  type="submit" 
  variant="outlined"
  >Lisää
</Button>
</form>


<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Note</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit2(tallenna)}>
          <Textarea
            {...register2('content',{required:true})}
            //defaultValue={activeNote.content}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Content"
            autoFocus
            maxRows={4}
            style={{ width: '100%', padding: '4px'}}
          />
          {errors2.content && <Error>Anna ohjelmointivihje</Error>}

          <Label 
          control={<Checkbox defaultChecked={activeNote.important}/>} label="Tärkeä" 
          {...register2("important")}
          />
          <DialogActions style={{  maxWidth: '200px', marginLeft: 'auto' }}>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>

</div>
)
}


export default Notes;