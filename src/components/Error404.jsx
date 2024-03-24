import {PageHeading} from "./index";
import {Container, Row} from "react-bootstrap";
import errorImg from '../assets/images/error/404-error-img.png';
import {Link} from "react-router-dom";

export default function Error404() {
  return (
    <>
      <PageHeading title='Erreur 404'/>
      <Container className='min-vh-100 d-flex justify-content-center align-items-center'>
        <Row>
          <div className='col-12'>
            <div className='text-center'>
              <div className='mb-3'>
                <img src={errorImg} alt="" className="img-fluid"/>
              </div>
              
              <h1 className="display-4 fw-bold">Oups ! La page est introuvable.</h1>
              <p className="mb-4">
                Ou profitez simplement de l’expertise de notre équipe de consultation.
              </p>
              <Link to='/app/profile' className='btn btn-primary'>Retour à l'accueil</Link>
            </div>
          </div>
        </Row>
      </Container>
    </>
  )
}
