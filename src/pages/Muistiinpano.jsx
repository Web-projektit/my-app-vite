import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getNote } from '../yhteydet';

const Muistiinpano = () => {
  const [note, setNote] = useState({});  
  const { id } = useParams();

  useEffect( () => {
     console.log('Muistiinpano,useEffect,id:',id)
     getNote(id).then(note => {  
      console.log('Muistiinpano, useEffect:',note)
      setNote(note)
      })    
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

  return (
    <div>
      <h1>Muistiinpano {note.id}</h1>
      <p>{note.content}</p>
      <p>Tärkeys: {note.important ? 'Tärkeä' : 'Ei tärkeä'}</p>
    </div>
  );
};

export default Muistiinpano;