import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from "react-router-dom";
import { basename } from "./yhteydet"
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
<Router basename={basename}>
    <App />
</Router>  
)