import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, PageHeading} from "../../../components";
import {memo} from "react";
import {Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import logo from '../../../assets/images/logo.png';
import LoginForm from "./loginForm";

const Login = () => {
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <PageHeading title='Login'/>
      <Card className='smooth-shadow-md'>
        <Card.Body className='p-6'>
          <div className='mb-4'>
            <img src={logo} className='me-1' width={36} height={36} alt=''/>
            <Link to='/login'>
              <span className='fw-bold'>
                ClinicOffice
              </span>
            </Link>
          </div>
          
          <h4 className="mb-2">Bienvenue chez ClinincOffice ! 👋</h4>
          <p className="mb-4">Veuillez vous connecter à votre compte</p>
          
          <LoginForm/>
        </Card.Body>
      </Card>
    </ErrorBoundary>
  )
}

export default memo(Login)
