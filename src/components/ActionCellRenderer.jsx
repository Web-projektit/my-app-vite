// ActionCellRenderer.js
import { FaEdit, FaTrash } from 'react-icons/fa';

const ActionCellRenderer = ( params ) => {
  
  const handleDelete = () => {
    // Lisää poisto-toiminto tähän
    alert(`Poistetaan rivi: ${params.data.id}`);
    }

  const handleEdit = () => {
    // Lisää muuta-toiminto tähän
    alert(`Muokataan riviä: ${params.data.id}`);
    }

  return (
    <>
      <FaEdit 
        style={{ color: 'blue', cursor: 'pointer', marginRight: '10px'}} 
        onClick={() => handleEdit() }
        />
      <FaTrash 
        style={{ color: 'red', cursor: 'pointer' }} 
        onClick={() => handleDelete() }
        />
      </>
  )
}

export default ActionCellRenderer
