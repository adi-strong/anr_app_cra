import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Card, Col} from "react-bootstrap";

export default function ProfileRendezvousTab() {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Col xxl={12} className='mb-5'>
        <Card>
          <Card.Body>
            <h4 className="card-title mt-3">Calendrier</h4>
          </Card.Body>
        </Card>
      </Col>
      
      <Col xxl={12}>
        <Card>
          <Card.Body>
            <h4 className="card-title mt-3">Mes Rendez-Vous</h4>
          </Card.Body>
        </Card>
      </Col>
    </ErrorBoundary>
  )
}
