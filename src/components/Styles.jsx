import styled from 'styled-components';
import { TextField, Button as Painike } from '@mui/material'
import Alert from '@mui/material/Alert'
import CheckIcon from '@mui/icons-material/Check';
import { Input as Check } from 'reactstrap'
import PropTypes from 'prop-types'

// Your component definition here...



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
    
const AlertOma = ({ children,color,close }) => (
    <Alert 
    icon={<CheckIcon fontSize="inherit" />} 
    severity={color}
    onClose={close}
    >
    {children}
    </Alert>
    )
    
AlertOma.propTypes = {
  children: PropTypes.node,
  color: PropTypes.oneOf(['error', 'info', 'success', 'warning']),
  close: PropTypes.func,
};    

export { Otsikko, Error, Input, Checkbox, Button, AlertOma as Alert }