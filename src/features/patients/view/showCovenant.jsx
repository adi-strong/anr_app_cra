import {useDispatch} from "react-redux";
import {memo, useEffect} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading, RowContent} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Link} from "react-router-dom";
import {Card, Col, Row} from "react-bootstrap";
import placeholderImg from "../../../assets/images/placeholder/placeholder-4by3.svg";
import CovenantsContractsList from "./covenantsContractsList";
import ApprovedPatientsList from "./approvedPatientsList";

const ShowCovenant = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'patients' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Convention'/>
      <PageLayout>
        <AppBreadcrumb title={`Convention / Société / Organisme`}/>
        <Link to='/app/covenants'>
          <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
        </Link>
        
        <Card className='mt-5'>
          <Card.Body>
            <Row>
              <Col md={4} className='mb-3'>
                <div>
                  <img src={placeholderImg} className='img-fluid w-100' height={199} alt=''/>
                </div> <hr/>
                
                <RowContent label='Dénomination' content='Orange RDC'/>
                <RowContent label='Point Focal' content='Debacker LIFWA'/>
                <RowContent label='N° Tél.' content='+243 904 651 464'/>
                <RowContent label='Email' content='orange.rdc@contact.com'/>
                
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
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card className='mt-9'>
          <ApprovedPatientsList/>
        </Card>
        
        <Card className='mt-9'>
          <CovenantsContractsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ShowCovenant)
