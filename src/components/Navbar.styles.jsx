import { NavLink as Link} from 'react-router-dom'
import styled from 'styled-components';

export const NavLink = styled(Link)`
color: #333;
font-size: 20px; 
text-decoration: none;
margin-right: 15px;
white-space:nowrap;
&.active {
/*filter: brightness(170%);*/
color: green;
}
`

export const Button = styled.button`
  margin-top:10px;
  min-width:100px;
  @media (min-width: 700px) {
    margin-top:0;
    margin-right:20px;
    position:absolute;
    right:0;
  }
`;