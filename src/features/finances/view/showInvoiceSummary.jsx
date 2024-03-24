import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import ShowInvoiceHeader from "./showInvoiceHeader";
import {useRef} from "react";
import {useReactToPrint} from "react-to-print";
import {Button, Card, Col, Row} from "react-bootstrap";
import logo from "../../../assets/images/logo.png";

const nStyle = {
  fontWeight: 800,
  color: '#0909b0'
}

export default function ShowInvoiceSummary() {
  const printRef = useRef()
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <div className='text-center mt-2'>
        <Button disabled={false} onClick={handlePrint}>
          <i className='bi bi-printer'/> Imprimer
        </Button>
      </div>
      
      <div className='container-fluid' ref={printRef}>
        <ShowInvoiceHeader title='FACTURE PATIENT'/>
        
        <Row className='mt-5 pt-1 px-10 pe-10 mb-3'>
          <Col sm={8}>
            <div className='mb-3'>
              <img src={logo} width={80} height={80} alt=''/>
            </div>
            
            <Card.Title className='fw-bold mb-3' style={{ fontSize: '0.7rem' }}>
              <span style={nStyle}>Centre hospitalier : Clinic Office</span>
            </Card.Title>
            
            <Card.Title className='fw-bold mb-3' style={{ fontSize: '0.7rem' }}>
            <span className='fw-bold'>
              Adresse : <br/>
            </span>
            </Card.Title>
            
            <Card.Title className='fw-bold mb-3' style={{ fontSize: '0.7rem' }}>
            <span className='fw-bold'>
              Code postal : <br/>
            </span>
            </Card.Title>
            
            <Card.Title className='fw-bold mb-3' style={{ fontSize: '0.7rem' }}>
            <span className='fw-bold'>
              Contact : <br/>
            </span>
            </Card.Title>
            
            <Card.Title className='fw-bold mb-3 mt-6' style={{ fontSize: '0.7rem' }}>
            <span className='fw-bold'>
              Numéro de facture / dossier  : <br/>
            </span>
            </Card.Title>
            
            <Card.Title className='fw-bold mb-3' style={{ fontSize: '0.7rem' }}>
            <span className='fw-bold'>
              Date d'envoi : <br/>
            </span>
            </Card.Title>
            
            <Card.Title className='fw-bold mb-3' style={{ fontSize: '0.7rem' }}>
            <span className='fw-bold'>
              Date de facture : <br/>
            </span>
            </Card.Title>
            
            <Card.Title className='fw-bold mb-3' style={{ fontSize: '0.7rem' }}>
            <span className='fw-bold'>
              Soin(s) du : <br/>
            </span>
            </Card.Title>
          </Col>
          
          <Col sm={4}>
            <div className='mb-14'/>
            
            <Card.Title className='fw-bold mb-3 mt-5' style={{ fontSize: '0.7rem' }}>
            <span className='fw-bold'>
              Nom, Postnom, Prénom : <br/>
            </span>
            </Card.Title>
            
            <Card.Title className='fw-bold mb-3 mt-5' style={{ fontSize: '0.7rem' }}>
            <span className='fw-bold'>
              Adresse : <br/>
            </span>
            </Card.Title>
          </Col>
        </Row>
      </div>
    </ErrorBoundary>
  )
}
