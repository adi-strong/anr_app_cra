import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "./index";
import {Col, Row} from "react-bootstrap";

export default function RowContent({md1 = 4, md2 = 8, label, content}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Row className='mb-3'>
        <Col md={md1} className='mb-1'>
          <span className='fw-bold'>{label}</span>
        </Col>
        <Col md={md2} className='mb-1'>: {content}</Col>
      </Row>
    </ErrorBoundary>
  )
}
