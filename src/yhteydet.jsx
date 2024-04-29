import axios from 'axios'
let basename = ''
const url = 'http://localhost:3001/notes'

const getNotes = () => {
    const promise = axios.get(url)
    return promise.then(response => response.data)
    }

const getNote = id => {
    const promise = axios.get(`${url}/${id}`)
    return promise.then(response => response.data)
    }

export { getNotes, getNote, basename }
