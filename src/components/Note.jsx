/* eslint-disable react/prop-types */
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const styleContent = { 
  marginRight: 10, 
  width: 500, 
  whiteSpace: 'nowrap', 
  overflow: 'hidden', 
  textOverflow: 'ellipsis' }

const Note = ({ note,handleOpen }) => {
    return (
      <li key={note.id}>
      <div style={{display:'flex'}}>
      <Link to={`/notes/${note.id}`} style={{ textDecoration: 'none', color: 'black' }}>    
      <div style={styleContent}>{note.content}</div>  
      </Link>    
      <div style={{ display: 'flex', gap: '10px' }}>
      <FaEdit 
        style={{ color: 'blue', cursor: 'pointer' }} 
        onClick={() => handleOpen(note) }
        />

      <FaTrash style={{ color: 'red', cursor: 'pointer' }} />
      </div>
      </div>
    </li>
    )
}

export default Note;