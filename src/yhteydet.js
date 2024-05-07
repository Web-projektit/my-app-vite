import axios from 'axios'
let basename = ''
const url = 'http://localhost:3001/notes'
const urlRestapi = 'http://localhost:5000/restapi'
const csrfUrl = urlRestapi + '/getcsrf'
const signupUrl = urlRestapi + '/register'
const loginUrl = urlRestapi + '/login'
const confirmUrl = urlRestapi + '/confirm'
const closeUrl = urlRestapi + '/logout'


const getNotes = () => {
    const promise = axios.get(url)
    return promise.then(response => response.data)
    }

const getNote = id => {
    const promise = axios.get(`${url}/${id}`)
    return promise.then(response => response.data)
    }

const updateNote = note => {
  console.log('updateNote: ',note)
  const promise = axios.put(`${url}/${note.id}`, note)
    .catch(error => {
      console.error('updateNote, Axios-virhe: ', error.message)
      throw error
    });
  return promise;
}

const addNote = note => {
    console.log('addNote: ',note)
    const promise = axios.post(url, note)
    return promise.then(response => response.data)
    }    
    
/*const deleteNote = id => {
    console.log('deleteNote,id:',id)
    axios.delete(`${url}/${id}`)
    .then(response => {
        console.log('handleClickConfirm,response.data:',response.data)
        return response.data
        })
    }
    
 const deleteNote = id => {
    console.log('deleteNote,id:',id)
    const promise = axios.delete(`${url}/${id}`)
    return promise.then(response => response.data)
    } */
    
const deleteNote = id => {
    console.log('deleteNote,id:',id)
    const promise = fetch(`${url}/${id}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
         })
    return promise.then(response => response.json())
    }

const csrfFetch = () => fetch(csrfUrl, {credentials: "include"})

const confirmFetch = () => 
    fetch(confirmUrl, {credentials: "include"})
    .then(response => response.text())  

const closeFetch = () => fetch(closeUrl,{credentials:'include'})

let loginFetch = (data,csrfToken,next) => {
    /* Huom. toimii myös ilman kauttaviivojen muuntamista
    next = encodeURIComponent(next) */
    let url = loginUrl+'?next='+next
    console.log("loginFetch,url:"+url) 
    return fetch(url,{
        method:'POST',
        headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json"
            },
        credentials:'include',
        // mode: 'cors',
        body:JSON.stringify(data)})
    .then(response => {
        console.log('loginFetch,response:',response.ok,response.status,response.url,response.redirected)
        return response.text()
        })  
    .catch(e => {
        console.error('loginFetch,e:',String(e))
        })    
    }


export { getNotes, getNote, addNote, updateNote, deleteNote, csrfFetch, 
         basename, urlRestapi, csrfUrl, signupUrl, confirmFetch, loginFetch, closeFetch }
