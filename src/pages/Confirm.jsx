/* Sähköpostiosoitevahvistuslinkin uudelleen lähetys */
import { useState,useEffect } from "react";
import { useAuth } from "../auth/Auth";
import { confirmFetch } from "../yhteydet"
import { Error } from "../components/Styles"

const Confirm = () => {
const { authTokens,setAuthConfirm } = useAuth();    
const [ilmoitus, setIlmoitus] = useState();
const [virhe, setVirhe] = useState();
console.log("Rendering Confirm")

useEffect(() => {
const handleStorageChange = event => {
    if (event.key === 'confirm') {
      setAuthConfirm(event.newValue)
      console.log('localStorage item confirm has changed:', event.newValue);
      }
    }
window.addEventListener('storage', handleStorageChange);
return () => window.removeEventListener('storage', handleStorageChange);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


useEffect(() => {
console.log(`Confirm,useEffect`)
confirmFetch(authTokens)
.then(data => {
    if (!data) {
        console.error('confirmFetch,ei dataa')
        return
        }
    const dataObj = JSON.parse(data)
    console.log(`confirmFetch,response data:`,dataObj)
    if (dataObj.ok) {
        setIlmoitus(dataObj.message);
        } 
    else if (dataObj.error) {
        setVirhe(dataObj.message)
        }    
    })
.catch(error => {
    console.error("Confirm, confirmFetch",error);
    setVirhe(error.message)
    })
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])
console.log(`Confirm,ilmoitus:${ilmoitus},virhe:${virhe}`)

if (ilmoitus) return (
    <div>
    <h3>Sähköpostiosoitteen vahvistuspyyntö on lähetetty.</h3>
    <p>{ilmoitus}</p>
    </div>
    )    

else if (virhe) return (
    <div>
    <h3>Sähköpostiosoitteen vahvistuspyyntöä ei lähetetty.</h3>
    <Error>{virhe}</Error>
    </div>
    )    
}


export default Confirm;