import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Card, Col, Row} from "react-bootstrap";

export default function ProfileOverviewTab() {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Col xxl={12}>
        <Card>
          <Card.Body>
            <h4 className="card-title mt-3">À propos</h4>
            <span className="text-uppercase fw-medium text-dark fs-5 ls-2">Bio</span>
            
            <p className="mt-2 mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspen disse var ius
              enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros
              dolor interdum nulla, ut commodo diam libero vitae erat.
            </p>
            
            <Row>
              <Col md={4} className='mb-3'>
                <Col xxl={12} className="mb-5">
                  <h6 className="text-uppercase fs-5 ls-2">Grade</h6>
                  <p className="mb-0">Theme designer at Bootstrap.</p>
                </Col>
                
                <Col xxl={12} className="mb-5">
                  <h6 className="text-uppercase fs-5 ls-2">Fonction</h6>
                  <p className="mb-0">Theme designer at Bootstrap.</p>
                </Col>
                
                <Col xxl={12} className="mb-5">
                  <h6 className="text-uppercase fs-5 ls-2">Département</h6>
                  <p className="mb-0">Theme designer at Bootstrap.</p>
                </Col>
                
                <Col xxl={12} className="mb-5">
                  <h6 className="text-uppercase fs-5 ls-2">Service</h6>
                  <p className="mb-0">Theme designer at Bootstrap.</p>
                </Col>
              </Col>
              
              <Col md={8} className='mb-3'>
                <Row>
                  <Col md={6} className="mb-5">
                    <h6 className="text-uppercase fs-5 ls-2">N° Tél.</h6>
                    <p className="mb-0">+32112345689</p>
                  </Col>
                  
                  <Col md={6} className="mb-5">
                    <h6 className="text-uppercase fs-5 ls-2">Date de Naissance</h6>
                    <p className="mb-0">01.10.1997</p>
                  </Col>
                  
                  <Col md={6} className="mb-5">
                    <h6 className="text-uppercase fs-5 ls-2">Email</h6>
                    <p className="mb-0">adi.life91@gmail.com</p>
                  </Col>
                  
                  <Col md={6} className="mb-5">
                    <h6 className="text-uppercase fs-5 ls-2">Adresse</h6>
                    <p className="mb-0">RD Congo / Kinshasa</p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </ErrorBoundary>
  )
}
