/* eslint-disable react/prop-types */
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const styleContent = { 
  marginRight: 10, 
  width: '75vw', 
  maxWidth: '500px',
  whiteSpace: 'nowrap', 
  overflow: 'hidden', 
  textOverflow: 'ellipsis' }

const Note = ({ note,handleOpen,handleConfirm }) => {
    return (
      <li key={note.id}>
      <div style={{display:'flex'}}>
      <Link to={`/notes/${note.id}`} style={{ textDecoration: 'none', color: 'black' }}>    
      <div style={styleContent} title={note.content}>{note.content}</div>  
      </Link>    
      <div style={{ display: 'flex', gap: '10px' }}>
      <FaEdit 
        style={{ color: 'blue', cursor: 'pointer' }} 
        onClick={() => handleOpen(note) }
        />
      <FaTrash 
        style={{ color: 'red', cursor: 'pointer' }} 
        onClick={() => handleConfirm(note.id) }
        />
      </div>
      </div>
    </li>
    )
}

export default Note;