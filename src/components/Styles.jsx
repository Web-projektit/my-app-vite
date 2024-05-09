import styled from 'styled-components';
import { TextField, Button as Painike } from '@mui/material'
import { Input as Check } from 'reactstrap'

const Otsikko = styled.h2`
  margin: 0 auto;
  padding: 1rem 2rem;
`;


const Error = styled.div`
    color: red;
    `;
  
const Input = styled(TextField)`
    && {
    max-width: 250px;
    height: 30px;
    margin-top:40px; 
    display: 'block'; 
    }
    `;
  
const Checkbox = styled(Check)`
    && {
    border-color: black;
    margin-top: 47px;
    padding: 8px;
    margin-bottom: 0;
    margin-right: 10px;
    }
    `;    

const Button = styled(Painike)`
    && {
    display: block;    
    margin: 10px 20px 10px auto;
    }
    `;    
    
export { Otsikko, Error, Input, Checkbox, Button }