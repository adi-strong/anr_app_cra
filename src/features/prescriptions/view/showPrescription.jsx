import {memo, useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Link} from "react-router-dom";
import {Button, Card, Table} from "react-bootstrap";
import {useReactToPrint} from "react-to-print";
import logo from '../../../assets/images/logo.png';

const nStyle = {
  fontWeight: 800,
  color: '#0909b0'
}
const uStyle = {
  borderBottom: '1px solid #000'
}
const uStyle2 = {
  borderBottom: '2px solid #0909b0'
}

const ShowPrescription = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'prescriptions' }))
  }, [dispatch])
  
  const printRef = useRef()
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Prescription médicale'/>
      <PageLayout>
        <AppBreadcrumb title={`Prescription médicale`}/>
        
        <div className='d-flex justify-content-between'>
          <Link to='/app/prescriptions'>
            <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
          </Link>
          
          <Button disabled={false} size='sm' variant='info' className='text-light' onClick={handlePrint}>
            <i className='bi bi-printer-fill'/> Imprimer
          </Button>
        </div>
        
        <Card className='mt-5'>
          <Card.Body>
            <div className='container-fluid' ref={printRef}>
              {/* HEADER ******************************************************************* */}
              <div className='mt-5 d-flex pt-10 px-10 pe-10 justify-content-between'>
                <h2 className='text-capitalize'>
                  <span className='me-1' style={nStyle}>Dr. Andrew</span>
                  <span className='dr-first-name'> Staton</span> <br/>
                  <small className='text-secondary text-uppercase fw-normal' style={{ fontSize: '1rem' }}>
                    Docteur
                  </small>
                </h2>
                
                <img src={logo} width={80} height={80} alt=''/>
              </div>
              {/* END HEADER *************************************************************** */}
              
              {/* PATIENT'S INFOS ********************************************************** */}
              <div className='px-10 pe-10'>
                <Table borderless className='mt-5 text-dark'>
                  <tbody>
                  <tr>
                    <th className='p-0'>Nom du Patient :</th>
                    <td className='p-0' style={uStyle}>Adivin LIFWA</td>
                    
                    <th/>
                    <th/>
                    
                    <th className='p-0'>Date :</th>
                    <td className='p-0' style={uStyle}>15 Mars 2024</td>
                  </tr>
                  </tbody>
                </Table>
              </div>
              
              <div className='px-10 pe-10'>
                <Table borderless className='mt-5 text-dark'>
                  <tbody>
                  <tr className='mb-3'>
                    <th className='p-0'>Âge :</th>
                    <td className='p-0' style={uStyle}>18 an(s)</td>
                    
                    <th/>
                    
                    <th className='p-0'>Sexe :</th>
                    <td className='p-0' style={uStyle}>Masculin</td>
                    
                    <th/>
                    
                    <th className='p-0'>Poids :</th>
                    <td className='p-0' style={uStyle}>61.5 Kg</td>
                  </tr>
                  </tbody>
                </Table>
              </div>
              {/* END PATIENT'S INFOS ****************************************************** */}
              
              {/* BODY ********************************************************************* */}
              <div className='px-10 pe-10'>
              </div>
              {/* END BODY ***************************************************************** */}
              
              {/* FOOTER ******************************************************************* */}
              <div className='text-end px-10 pe-10'>
                <p className='w-30' style={uStyle2}>
                  <span style={{ position: 'relative', top: 30, right: 120 }}>Signature</span>
                </p>
              </div>
              
              <div className='text-center bg-light d-flex justify-content-between mt-10 mx-10 me-10 pt-5 pb-5 px-5 pe-5'>
                <span>
                  <i className='bi bi-geo-alt-fill me-1'/>
                  24 Dummy Street Area
                </span>
                
                <span>
                  <i className='bi bi-telephone-fill me-1'/>
                  +243 904 651 464
                </span>
                
                <span>
                  <i className='bi bi-envelope-fill me-1'/>
                  Email ID Space
                </span>
              </div>
              {/* END FOOTER *************************************************************** */}
            </div>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ShowPrescription)
