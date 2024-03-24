import {useDispatch} from "react-redux";
import {memo, useEffect} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading, RowContent} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Link} from "react-router-dom";
import {Card, Col, Row} from "react-bootstrap";
import placeholderImg from '../../../assets/images/placeholder/placeholder-4by3.svg';

const ShowPatient = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'patients' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Patient(e)'/>
      <PageLayout>
        <AppBreadcrumb title={`Patient(e)`}/>
        <Link to='/app/patients'>
          <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
        </Link>
        
        <Card className='mt-5'>
          <Card.Body>
            <Row>
              <Col md={4} className='mb-3'>
                <div>
                  <img src={placeholderImg} className='img-fluid w-100' height={199} alt=''/>
                </div> <hr/>
                
                <RowContent label='Nom' content='LIFWA'/>
                <RowContent label='Postnom' content="WAN'ETUMBA"/>
                <RowContent label='Prénom' content='Adivin'/>
                <RowContent label='Convention.. ?' content='NON'/>
                
                <Link
                  style={{ cursor: 'pointer' }}
                  className='me-3 card-link'
                  to={`/app/patients/${1}/edit`}>
                  <i className='bi bi-pencil-square'/> Modifier
                </Link>
                
                |
                
                <Card.Link style={{ cursor: 'pointer' }} className='text-danger'>
                  <i className='bi bi-trash'/> Supprimer
                </Card.Link>
              </Col>
              
              <Col md={8} className='mb-3' style={{ borderLeft: '1px solid lightgray' }}>
                <RowContent label='Sexe' content='Masculin'/>
                <RowContent label='Âge' content='18 an(s)'/>
                <RowContent label='Lieu & date de naissance' content='05/03/1989 / Kinshasa'/>
                <RowContent label='Nationalité' content='Congolaise'/>
                <RowContent label='État-civil' content='Célibataire'/>
                <RowContent label='Adresse' content='Kinshasa / Limete'/>
                <RowContent label='N° Tél.' content='+243 904 651 464'/>
                <RowContent label='Email' content='adi.life91@gmail.com'/>
                <RowContent label='Nom du père' content='JR LIFWA LOKONA'/>
                <RowContent label='Nom de la mère' content='JEANINE NKOLO LIFWA'/>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ShowPatient)

