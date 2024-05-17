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

const confirmFetch = token => 
    fetch(confirmUrl,{
        credentials:'include',
        headers:{"authorization":`bearer ${token}`}
        })
    .then(response => {
        if (!response.ok) {
          throw new Error(`Unauthorized,status:${response.status}`);
          }
        return response.json();
      })
    .catch(e => {
        console.error('confirmFetch:',String(e))
        throw e
        })

const closeFetch = token => fetch(closeUrl,{
    credentials:'include',
    headers:{"authorization":`bearer ${token}`}
    })
  
import { useState, useEffect, useCallback } from 'react';

function useFormSubmit({url, csrfUrl, authToken, setError}) {
    /* Huom. tilamuuttujan muuttaminen aiheuttaa isäntäkomponenin uudelleenrenderöinnin */
    const [csrfToken, setCsrfToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);

    console.log('useFormSubmit,url:',url,'csrfUrl:',csrfUrl,',authToken:',authToken,',csrfToken:',csrfToken)  
  
    useEffect(() => {  
      fetch(csrfUrl, { credentials: 'include' }) // Ensure cookies are sent
        .then(response => setCsrfToken(response.headers.get("X-CSRFToken")))
        .catch(err => {
            let message = 'CSRF-tokenin haku epäonnistui.'
            setError('apiError',{ message:message })
            console.error(err)
            })     
      }, [csrfUrl,setError])

    // Function to submit data with CSRF token
    const submit = data => {
        const setErrors = errors => {
            for (let kentta in errors) {
              console.log(`setErrors, ${kentta}:${errors[kentta]}`)
              setError(kentta,{type:"palvelinvirhe",message:errors[kentta]})
              }
            }  
      
        const header = (authToken) ? { 'Authorization': `Bearer ${authToken}` } : {}
        setIsLoading(true)
        fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
                "X-CSRFToken": csrfToken,
                ...header
            },
            credentials:'include', // Include cookies if needed for sessions
            body: JSON.stringify(data)
        })
        .then(response => {
            console.log('useFormSubmit,response:',response.ok,response.status,response.url,response.redirected)
            if (!response.ok) {
                throw new Error(`Yhteysvirhe: ${response.status} ${response.statusText}`)
                }
            const authHeader = response.headers.get('Authorization')
            const token = authHeader ? authHeader.split(' ')[1] : null;
            console.log('useFormSubmit,Authorization header:',authHeader,'token:',token) 
            /* Huom.
            The token variable can be used in the next .then 
            part because of the closure property in JavaScript. 
            The callback function passed to .then has access to 
            the token variable since it was defined in the same 
            scope where the callback was created. This mechanism 
            allows the callback to "remember" the token variable 
            and use it when the Promise resolves.
            */
            return response.json().then(jsonData => ({ ...jsonData, token: token }))
           })  
        .then(data => {
            setData(data);
            console.log('useFormSubmit, response data:',data);
            if (data?.status === 'virhe') {
              if (data.message?.includes('csrf')) {
                console.error("csrf-virhe,message:",data.message)
                setError('apiError',{ message:data.message })                }
              else if (data.errors){
                console.error('data.errors:',data.errors)
                setErrors(data.errors)
                }
              else {
                /* Huom. kaikissa lomakkeissa ei ole password2-kenttää */   
                console.log('data.message:',String(data.message))
                setError('otherError',{message: data.message})
                }
              }
        })
        .catch(err => {
            let message = 'Tallennus palvelimelle epäonnistui'
            setError('apiError',{ message:message })
            console.error("useFormSubmit:",err);
        })
        .finally(() => {
           setIsLoading(false);
        });
    }
    const submitData = useCallback(submit, [csrfToken, url, authToken, setError]);
    return { submitData, isLoading, data };
}

const clearFormErrors = (event,errors,clearErrors) => { 
    const field = event.target.name
    if (errors[field]?.type === 'palvelinvirhe') clearErrors(field)
    if (errors['otherError']) clearErrors('otherError')  
    if (errors['apiError']) clearErrors('apiError')    
    }
          
export { getNotes, getNote, addNote, updateNote, deleteNote, csrfFetch, 
         basename, urlRestapi, csrfUrl, loginUrl, signupUrl, resetPasswordUrl, uusisalasanaUrl,confirmFetch,  
         closeFetch, useFormSubmit, clearFormErrors }
