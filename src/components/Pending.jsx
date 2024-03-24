import {Container, Spinner} from "react-bootstrap";
import logo from '../assets/images/logo.png';

export default function Pending() {
  return (
    <Container className='mt-5 text-primary'>
      <h4>
        <Spinner animation='grow' className='text-primary me-1'/>
        <img src={logo} className='me-1' alt=''/>
        Chargement en cours
      </h4>
    </Container>
  )
}
