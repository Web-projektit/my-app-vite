import axios from 'axios'
let basename = ''
const url = 'http://localhost:3001/notes'
const urlRestapi = 'http://localhost:5000/restapi'
const csrfUrl = urlRestapi + '/getcsrf'
const signupUrl = urlRestapi + '/register'
const loginUrl = urlRestapi + '/login'
const confirmUrl = urlRestapi + '/confirm'
const closeUrl = urlRestapi + '/logout'
const uusisalasanaUrl = urlRestapi + '/reset'
const resetPasswordUrl = urlRestapi + '/reset_password'

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

const confirmFetch = (token) => 
    fetch(confirmUrl,{
        credentials:'include',
        headers:{"authorization":`bearer ${token}`}
        })
    .then(response => {
        if (!response.ok) {
          throw new Error(`Unauthorized,status:${response.status}`);
          }
        return response.text();
      })
    .catch(e => {
        console.error('confirmFetch:',String(e))
        throw e
        })

const closeFetch = (token) => fetch(closeUrl,{
    credentials:'include',
    headers:{"authorization":`bearer ${token}`}
    })

const loginFetch = (data,csrfToken,next) => {
    /* Huom. toimii myös ilman kauttaviivojen muuntamista
    next = encodeURIComponent(next) */
    let url = next ? loginUrl+'?next='+next : loginUrl
    console.log("loginFetch,url:"+url) 
    return fetch(url,{
        method:'POST',
        headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json"
            },
        credentials:'include',
        body:JSON.stringify(data)})
    .then(response => {
        console.log('loginFetch,response:',response.ok,response.status,response.url,response.redirected)
        if (!response.ok) {
            throw new Error('Network response was not ok')
          }
        const authHeader = response.headers.get('Authorization')
        const token = authHeader ? authHeader.split(' ')[1] : null;
        console.log('loginFetch,Authorization header:',authHeader,'token:',token) 
        return response.json().then(data => ({...data,token:token}))
        })  
    .catch(error=> {
        console.error('loginFetch:',error)
        throw error
        })    
    }

const uusisalasanaFetch = (data,csrfToken) => {
    console.log("uusisalasanaFetch,url:"+uusisalasanaUrl) 
    return fetch(uusisalasanaUrl,{
        method:'POST',
        headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json"
            },
        credentials:'include',
        body:JSON.stringify(data)})
    .then(response => {
        console.log('uusisalasanaFetch,response:',response.ok,response.status,response.url,response.redirected)
        if (!response.ok) {
            throw new Error('Network response was not ok')
            }
        return response.json()
        })  
    .catch(error=> {
        console.error('uusisalasanaFetch:',error)
        throw error
        })    
    }

    const resetPasswordFetch = (data,csrfToken,token) => {
        console.log("resetFetch,url:"+resetPasswordUrl) 
        let url = resetPasswordUrl+'/'+token
        return fetch(url,{
            method:'POST',
            headers: {
                "X-CSRFToken": csrfToken,
                "Content-Type": "application/json"
                },
            credentials:'include',
            body:JSON.stringify(data)})
        .then(response => {
            console.log('resetPasswordFetch,response:',response.ok,response.status,response.url,response.redirected)
            if (!response.ok) {
                throw new Error('Network response was not ok')
                }
            return response.json()
            })  
        .catch(error=> {
            console.error('resetPasswordFetch:',error)
            throw error
            })    
        }
    
import { useState, useEffect, useCallback } from 'react';

function useFormSubmit(url, authToken) {
    const [csrfToken, setCsrfToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const fetchCsrfUrl = csrfUrl
    
    // Fetch CSRF token
    useEffect(() => {  
      fetch(fetchCsrfUrl, { credentials: 'include' }) // Ensure cookies are sent
        .then(response => setCsrfToken(response.headers.get("X-CSRFToken")))
        .catch(err => {
            setError('Failed to fetch CSRF token');
            console.error(err);
            });
      }, [fetchCsrfUrl])

    // Function to submit data with CSRF token
    const onsubmit = data => {
        const header = (authToken) ? { 'Authorization': `Bearer ${authToken}` } : {}
        setIsLoading(true);
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "X-CSRFToken": csrfToken, 
                ...header
            },
            body: JSON.stringify(data),
            credentials: 'include' // Include cookies if needed for sessions
        })
        .then(response => response.json())
        .then(data => {
            setData(data);
            setError(null);
        })
        .catch(err => {
            setError('Failed to submit data');
            console.error(err);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }
    const submitData = useCallback(onsubmit, [csrfToken, url, authToken]);

    return { submitData, isLoading, error, data };
}

          
export { getNotes, getNote, addNote, updateNote, deleteNote, csrfFetch, 
         basename, urlRestapi, csrfUrl, signupUrl, confirmFetch, loginFetch, 
         uusisalasanaFetch, resetPasswordFetch, closeFetch, useFormSubmit }
