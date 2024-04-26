import { NavLink as Link} from 'react-router-dom'
import styled from 'styled-components';

export const NavLink = styled(Link)`
color: #333;
font-size: 20px; 
text-decoration: none;
margin-right: 15px;
white-space:nowrap;
&.active {
filter: brightness(170%);
}
`