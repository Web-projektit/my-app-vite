import axios from 'axios'
let basename = ''
const getNotes = () => {
    const promise = axios.get('http://localhost:3001/notes')
    return promise.then(response => response.data)
    }

export { getNotes, basename }
