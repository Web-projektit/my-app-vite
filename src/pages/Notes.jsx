import { useState,useEffect } from 'react';
import { useForm } from "react-hook-form"
import { Error } from '../components/Styles'
import { Dialog, DialogTitle, DialogContent, 
        DialogActions, Button, 
        FormControlLabel as Label,
        TextField as Input, 
        Checkbox } from '@mui/material'
import { getNotes, addNote, updateNote, deleteNote } from '../yhteydet';
import Note from '../components/Note'

const Notes = () => {
const [notes, setNotes] = useState([])
const [open, setOpen] = useState(false);
const [activeNote, setActiveNote] = useState({});

/* f2 = useForm() */
/* Useamman lomakekontekstin määrittely ja kutsu f2.reset(), 
   tai nimeämälä funktio erikseen ja kutsu reset2() */
const {register,handleSubmit,formState:{ errors }} = useForm()
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
  

const onSubmit = data => {
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
    <h1>Notes</h1>
    <p>Here you can find all the notes</p>
    <ul style={{ }}>
    { notes.map(note => <Note key={note.id} note={note} handleOpen={handleClickOpen} handleConfirm={handleClickConfirm}/>) }
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


<Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Note</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit2(tallenna)}>
          <Input
            {...register2('content',{required:true})}
            //defaultValue={activeNote.content}
            variant="outlined"
            margin="normal"
            fullWidth
            label="Content"
            autoFocus
          />
          {errors2.content && <Error>Anna ohjelmointivihje</Error>}

          <Label 
          control={<Checkbox defaultChecked={activeNote.important}/>} label="Tärkeä" 
          {...register2("important")}
          />
          <DialogActions>
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