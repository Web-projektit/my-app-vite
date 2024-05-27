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
const changeEmailUrl = urlRestapi + '/change_email'

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

function useGetUser({url, authTokens, setError, reset}) {
  const [userLoading, setUserLoading] = useState(false);
  useEffect(() => {
    if (authTokens) {
      setUserLoading(true);
      fetch(url, {
        headers: {'Authorization': `Bearer ${authTokens}`}
        })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Yhteysvirhe: ${response.status} ${response.statusText}`)
          }
        return response.json();
        })
      .then(data => {
        if (data?.status === 'virhe') {
          let message = data.message
          setError('apiError',{ message:message })
          }
        else if (data?.status === 'ok' && data.data) { 
          reset(data.data)
          }
        })
      .catch(err => {
        let message = `Profiilitietojen haku epäonnistui (${err})`
        setError('apiError',{ message:message })
        })
      .finally(() => {
        setUserLoading(false);
      });
    }
  }, [url, authTokens, reset, setError])


  return { userLoading };
}

function useGetData({ url,authTokens,showAlert }) {
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  const clear = () => setError('')

  useEffect(() => {
    console.log('useGetData,url:',url,',authTokens:',authTokens)
    if (authTokens) {
      setDataLoading(true);
      fetch(url, {
        headers: {'Authorization': `Bearer ${authTokens}`}
        })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Yhteysvirhe: ${response.status} ${response.statusText}`)
          }
        return response.json();
        })
      .then(data => {
        if (data?.status === 'virhe') {
          showAlert(data.message,'error')
          }
        else if (data?.status === 'ok' && data.data) { 
          showAlert(data.message,'success')
          setData(data.data)
          }
        })
      .catch(err => {
        let message = `Tietojen haku epäonnistui, url:${url} (${err})`
        //setError(message)
        showAlert(message,'error')
        })
      .finally(() => {
        setDataLoading(false);
      });
    }
  }, [url, authTokens, showAlert, setData, setDataLoading])

return { dataLoading,data,error,clear };
}

const useGetCsrf = (showAlert) => {
  const [csrfToken, setCsrfToken] = useState('');
  const [csrfLoading, setCsrfLoading] = useState(false);
  //const [csrfError, setCsrfError] = useState(null);
  useEffect(() => {
    setCsrfLoading(true);
    fetch(csrfUrl, { credentials: 'include' }) // Ensure cookies are sent 
    .then(response => {
      if (!response.ok) {
        throw new Error('Verkkovirhe CSRF-tokenin haussa');
        }
      setCsrfToken(response.headers.get("X-CSRFToken"))
      })
    .catch(err => {
        let message = 'CSRF-tokenin haku epäonnistui.'
        //setCsrfError(message)
        showAlert(message,'error')
        console.error(err)
        })
    .finally(() => {
        setCsrfLoading(false);
        });
    }, [showAlert])

  return { csrfToken, csrfLoading }
  }   

function useSaveData({ url,authTokens,showAlert }) {
  const { csrfToken, loading: csrfLoading } = useGetCsrf(showAlert)
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState({});
  //const [error, setError] = useState('');
  //const [success, setSuccess] = useState('')
 
  /*
    const clearMessages = () => {
    setError('')
    setSuccess('')
    }*/

  const saveData = (dataSave) => {
    if (csrfLoading) {
      //setError(csrfError)
      //showAlert(csrfError,'error')
      return
      }
    const header = (authTokens) ? { 'Authorization': `Bearer ${authTokens}` } : {}
    setDataLoading(true);
    fetch(url, {
      method: 'POST',
      headers: {
          "Content-Type": 'application/json',
          "X-CSRFToken": csrfToken,
          ...header
          },
      credentials:'include', // Include cookies if needed for sessions
      body: JSON.stringify(dataSave)
      })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Yhteysvirhe: ${response.status} ${response.statusText}`)
            }
        return response.json()
        })
    .then(data => {
        if (data?.status === 'virhe') {
          showAlert(data.message,'error')
          }
        else if (data?.status === 'ok') { 
          showAlert(data.message,'success')
          setData(data)
          }
        })
    .catch(err => {
        let message = `Tietojen tallennus epäonnistui (${err})`
        //setError(message)
        showAlert(message,'error')
        })  
    .finally(() => {
        setDataLoading(false);
        });
    }
  
  const tallenna = useCallback(saveData, [url,
    authTokens,
    csrfToken,
    // csrfError,
    csrfLoading,
    setData,
    showAlert,
    setDataLoading
    ])  
  
  //const clear = useCallback(clearMessages, [setError,setSuccess])  
    
  // return { dataLoading,data,error,success,clear,tallenna }
  return { dataLoading,data,tallenna }
  }

function useFormSubmit({url, csrfUrl, authTokens, setError}) {
    /* 
    Tilamuuttujan muuttaminen aiheuttaa isäntäkomponenin uudelleenrenderöinnin.
    Myös onnistumisesta on hyvä ilmoittaa ja tyhjentää tämäkin ilmoitus
    mitä tahansa kenttää muutettaessa. 
    
    Kaikki komponentin lomakkeen tilamuuttujat
    kannattaa päivittää tässä yhdessä lomakkeen muun 
    tilan kanssa, komponentissa ne aiheuttavat helposti
    ikuisen silmukan react-hook-formin tilamuutosten kanssa.
     */
    
    const [csrfToken, setCsrfToken] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(null);
    const [successMessage, setSuccessMessage] = useState('')
    console.log('useFormSubmit,url:',url,'csrfUrl:',csrfUrl,',authTokens:',authTokens,',csrfToken:',csrfToken)  
  
    useEffect(() => {  
      fetch(csrfUrl, { credentials: 'include' }) // Ensure cookies are sent
        .then(response => setCsrfToken(response.headers.get("X-CSRFToken")))
        .catch(err => {
            let message = 'CSRF-tokenin haku epäonnistui.'
            setError('apiError',{ message:message })
            console.error(err)
            })     
      }, [csrfUrl,setError])

    /* 
    Huom. authTokens on json-merkkijono lainausmerkeissä. 
    Ne täytyy poistaa JSON.parse-metodilla. Aikaisemmissa 
    versioissa tämä ei ollut tarpeen, koska authTokens-arvoa
    ei käytetty palvelimen httpAuth-token-autentikointiin, vaan
    ainoastaan React-käyttöliittymän tilan hallintaan Boolean-arvona.   
    */
    const submit = data => {
        const setErrors = errors => {
            for (let kentta in errors) {
              console.log(`setErrors, ${kentta}:${errors[kentta]}`)
              setError(kentta,{type:"palvelinvirhe",message:errors[kentta]})
              }
            }  
      
        const header = (authTokens) ? { 'Authorization': `Bearer ${authTokens}` } : {}
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
            setSuccessMessage(data.message)
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
    const submitData = useCallback(submit, [csrfToken, url, authTokens, setError]);
    return { submitData, isLoading, data, successMessage, setSuccessMessage };
}

const clearFormErrors = (event,errors,clearErrors,setSuccessMessage) => { 
    const field = event.target.name
    if (setSuccessMessage) setSuccessMessage('')
    if (errors[field]?.type === 'palvelinvirhe') clearErrors(field)
    if (errors['otherError']) clearErrors('otherError')  
    if (errors['apiError']) clearErrors('apiError')    
    }
     

const useAlert = () => {
  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });

  const showAlert = (message, type = 'info') => {
    setAlert({ visible: true, message, type });
    setTimeout(() => {
      setAlert({ visible: false, message: '', type: '' });
      }, 10000); // Automaattinen piilottaminen 10 sekunnin kuluttua
    }

  const hideAlert = () => {
    setAlert({ visible: false, message: '', type: '' });
    }

  return { alert,showAlert,hideAlert }
  }

     
export { getNotes, getNote, addNote, updateNote, deleteNote, csrfFetch, 
         basename, urlRestapi, csrfUrl, loginUrl, signupUrl, resetPasswordUrl, uusisalasanaUrl,
         changeEmailUrl, confirmFetch,  closeFetch, 
         useAlert, useGetUser, useGetData, useFormSubmit, 
         useSaveData, clearFormErrors }
