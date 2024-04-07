import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Card, Col, Row} from "react-bootstrap";
import PropTypes from "prop-types";
import {FadeSpinLoader} from "../../../loaders";

export default function ShowUserOverview({loader, error, data}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Col xxl={12}>
        <Card>
          <Card.Body>
            {!(error && loader) && data && (
              <>
                <h4 className="card-title mt-3">À propos</h4>
                <span className="text-uppercase fw-medium text-dark fs-5 ls-2">Job Description</span>
                
                <div className="mt-2 mb-6" style={{ whiteSpace: 'pre-line' }}>
                  {data?.agentAccount && data.agentAccount?.job && data.agentAccount.job?.description}
                </div>
                
                <Row>
                  <Col md={4} className='mb-3'>
                    <Col xxl={12} className="mb-5">
                      <h6 className="text-uppercase fs-5 ls-2">Grade</h6>
                      <p className="mb-0 text-capitalize">
                        {data?.agentAccount && data.agentAccount?.grade && data.agentAccount.grade?.name}
                      </p>
                    </Col>
                    
                    <Col xxl={12} className="mb-5">
                      <h6 className="text-uppercase fs-5 ls-2">Fonction</h6>
                      <p className="mb-0 text-capitalize">
                        {data?.agentAccount && data.agentAccount?.job && data.agentAccount.job?.name}
                      </p>
                    </Col>
                    
                    <Col xxl={12} className="mb-5">
                      <h6 className="text-uppercase fs-5 ls-2">Département</h6>
                      <p className="mb-0 text-capitalize">
                        {data?.agentAccount && data.agentAccount?.department && data.agentAccount.department?.name}
                      </p>
                    </Col>
                    
                    <Col xxl={12} className="mb-5">
                      <h6 className="text-uppercase fs-5 ls-2">Service</h6>
                      <p className="mb-0 text-capitalize">
                        {data?.agentAccount && data.agentAccount?.service && data.agentAccount.service?.name}
                      </p>
                    </Col>
                  </Col>
                  
                  <Col md={8} className='mb-3'>
                    <Row>
                      <Col md={6} className="mb-5">
                        <h6 className="text-uppercase fs-5 ls-2">N° Tél.</h6>
                        <p className="mb-0">{data?.phone && data.phone}</p>
                      </Col>
                      
                      <Col md={6} className="mb-5">
                        <h6 className="text-uppercase fs-5 ls-2">Email</h6>
                        <p className="mb-0">{data?.email && data.email}</p>
                      </Col>
                      
                      <Col md={6} className="mb-5">
                        <h6 className="text-uppercase fs-5 ls-2">Adresse</h6>
                        <p className="mb-0">
                          {data?.agentAccount && data.agentAccount?.address && data.agentAccount.address}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            )}
            
            {loader && <FadeSpinLoader loading={loader}/>}
          </Card.Body>
        </Card>
      </Col>
    </ErrorBoundary>
  )
}

ShowUserOverview.propTypes = {
  loader: PropTypes.bool,
  error: PropTypes.bool,
  data: PropTypes.any
}
