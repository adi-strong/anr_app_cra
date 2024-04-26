import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, PageHeading} from "../../../components";
import {memo} from "react";
import {Card, Form} from "react-bootstrap";
import {Link} from "react-router-dom";
// import logo from '../../../assets/images/logo.png';
import LoginForm from "./loginForm";
import {useDispatch, useSelector} from "react-redux";
import {toggleShowTheme} from "../../config/theme.slice";

const Login = () => {
  const dispatch = useDispatch()
  const {show} = useSelector(state => state.theme)
  
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <PageHeading title='Login'/>
      <Card className='smooth-shadow-md'>
        <Card.Body className='p-6'>
          <div className='mb-4'>
            {/*<img src={logo} className='me-1' width={36} height={36} alt=''/>*/}
            <Link to='/login'>
              <span className='fw-bold'>
                ANR
              </span>
            </Link>
          </div>
          
          {/*<h4 className="mb-2">Bienvenue chez ClinincOffice ! 👋</h4>*/}
          <p className="mb-4">Veuillez vous connecter à votre compte</p>
          
          <LoginForm/>
        </Card.Body>
      </Card>
      
      <div className='justify-content-center d-flex mt-5'>
        <i className={`bi bi-sun${!show ? '-fill text-primary' : ''} me-2`}/>
        <Form.Switch value={show} checked={show} onChange={() => dispatch(toggleShowTheme())}/>
        <i className={`bi bi-moon${show ? '-fill text-primary' : ''}`}/>
      </div>
    </ErrorBoundary>
  )
}

export default memo(Login)
