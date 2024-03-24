import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../components";
import {Outlet} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";

function LoginLayout() {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Container className='d-flex flex-column'>
        <Row className='align-items-center justify-content-center g-0 min-vh-100'>
          <Col md={8} lg={6} xxl={4} className='py-8 py-xl-0'>
            <Outlet/>
          </Col>
        </Row>
      </Container>
    </ErrorBoundary>
  )
}

export default LoginLayout
