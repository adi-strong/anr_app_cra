import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect, useRef} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Link, useParams} from "react-router-dom";
import {Button, Card, Col, Row, Table} from "react-bootstrap";
import {useReactToPrint} from "react-to-print";
import logo from "../../../assets/images/logo.png";

const nStyle = {
  fontWeight: 800,
  color: '#0909b0'
}

const uStyle2 = { borderBottom: '2px solid #0909b0' }

const ShowExpense = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'finances' }))
  }, [dispatch])
  
  const {id} = useParams()
  const printRef = useRef()
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title={'Dépense n°' + id}/>
      <PageLayout>
        <AppBreadcrumb title={`Bon de sorties n°${id}`}/>
        
        <div className='d-flex justify-content-between'>
          <Link to='/app/expenses'>
            <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
          </Link>
          
          <Button disabled={false} size='sm' variant='info' className='text-light' onClick={handlePrint}>
            <i className='bi bi-printer-fill'/> Imprimer
          </Button>
        </div>
        
        <Card className='mt-5'>
          <Card.Body>
            <div className='container-fluid' ref={printRef}>
              <div className='mt-5 pt-10 px-10 pe-10 mb-3' style={uStyle2}>
                <Row>
                  <Col sm={6} className='mb-3'>
                    <img src={logo} width={80} height={80} alt=''/>
                  </Col>
                  
                  <Col sm={6} className='mb-3 text-end text-dark'>
                    N° 1 | le 21 Mars 2024
                  </Col>
                </Row>
                
                <h2 style={nStyle} className='text-center'>CLINIC OFFICE</h2>
                <h6 className='text-center'>rue Philippe 49 731 Dumas-sur-Lebrun</h6>
              </div>
              
              <div className='mt-5 px-10 pe-10 mb-3 text-center'>
                <h4 className='card-title fw-bold'>BON DE DÉPENSES</h4>
                
                <div className='mt-8 text-start'>
                  <Card.Title className='mb-6'>
                    <span className="fw-bold">Objet</span> : <br/>
                  </Card.Title>
                  
                  <Card.Title>
                    <span className="fw-bold">Bénéficiaire</span> : <br/>
                  </Card.Title>
                </div>
              </div>
              
              <div className='mt-5 mb-3'>
                <Table responsive bordered>
                  <thead>
                  <tr>
                    <th className="text-center">DÉSIGNATION</th>
                    <th className="text-center">NOMBRE</th>
                    <th className="text-end">MONTANT (FC)</th>
                  </tr>
                  </thead>
                  
                  <tbody>
                  </tbody>
                </Table>
              </div>
              
              <Row className='mt-5 mb-3'>
                <Col sm={6}>
                  <Card.Title>SECRÉTARIAT</Card.Title>
                </Col>
                
                <Col sm={6} className='text-end'>
                  <div className='w-30 float-end text-dark' style={{ borderBottom: 'solid 1px #000' }}>
                    <span>SIGNATURE</span>
                  </div>
                </Col>
              </Row>
            </div>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ShowExpense)
