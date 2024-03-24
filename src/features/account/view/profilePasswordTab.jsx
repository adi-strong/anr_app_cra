import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Card, Col, Row} from "react-bootstrap";
import ChangePasswordForm from "./changePasswordForm";

export default function ProfilePasswordTab() {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Col xxl={12}>
        <Card>
          <Card.Body>
            <h4 className="card-title mt-3">Modifier Mot de Passe</h4>
            
            <Row>
              <Col md={4} className='mb-3'>
                <Col xxl={12} className="mb-5">
                  <h6 className="text-uppercase fs-5 ls-2">Username</h6>
                  <p className="mb-0">@adi.life</p>
                </Col>
                
                <Col xxl={12} className="mb-5">
                  <h6 className="text-uppercase fs-5 ls-2">Nom complet</h6>
                  <p className="mb-0">ADIVIN LIFWA WAN'ETUMBA</p>
                </Col>
              </Col>
              
              <Col md={8} className='mb-3'>
                <ChangePasswordForm/>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </ErrorBoundary>
  )
}
