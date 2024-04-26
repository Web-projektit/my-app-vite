import { useState } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav } from 'reactstrap';
import { NavLink } from './Navbar.styles';
import { FaBars, FaTimes } from 'react-icons/fa'
/*
Tässä on käytetty reactstrapin Navbar-ratkaisua sen yksinkertaisuuden vuoksi.
Siinä on kuitenkin seuraavat puutteet:
- Aktiivinen linkki ei erotu muista linkeistä
- Hampurilaisikoniin ilmestyy valittaessa tumma korostus, joka ei poistu
- Avatun valikon hampurilaisikoni ei vaihdu sulkemisikoniin
- NavItem vaikuttaa olevan tarpeeton

Tässä aktiivisen linkin korostus on toteutettu omalla NavLink-tyylillä,
joka perustuu react-router-domin NavLink-komponenttiin.  Omaa tyyliä
on tarvittu muokkaamaan NavLink reactstrapin NavLink-komponentin näköiseksi ja
muotoilemaan aktiivinen linkki.

Bootstrapin box-shadow on nollattu site.css-tiedostossa, ja react-icons-kirjaston 
FaTimes-ikoni näytetään FaBarista avatussa valikossa. Alkuperäinen NavItem on poistettu.
*/

export const NavbarReactstrap = () => {
  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => {
    setIsOpen(!isOpen)
    }
  return (
    <div>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="/">Tutorial</NavbarBrand>
        <NavbarToggler onClick={toggle}>
        {isOpen ? <FaTimes /> : <FaBars />}
        </NavbarToggler> 
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavLink activeclassname="active" to="/notes/">Notes</NavLink>
            <NavLink activeclassname="active" to="/lomake/">Lomake</NavLink> 
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  )
}
