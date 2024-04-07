import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Card, Col, Row} from "react-bootstrap";
import ChangePasswordForm from "./changePasswordForm";
import PropTypes from "prop-types";
import {FadeSpinLoader} from "../../../loaders";

export default function ProfilePasswordTab({err, data, loader}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Col xxl={12}>
        <Card>
          <Card.Body>
            <h4 className="card-title mt-3">Modification du Mot de Passe</h4>
            
            {!(loader && err) && data && (
              <Row>
                <Col md={4} className='mb-3'>
                  <Col xxl={12} className="mb-5">
                    <h6 className="text-uppercase fs-5 ls-2">Username</h6>
                    <p className="mb-0">@{data.username}</p>
                  </Col>
                  
                  <Col xxl={12} className="mb-5">
                    <h6 className="text-uppercase fs-5 ls-2">Nom complet</h6>
                    <p className="mb-0 text-uppercase">{data?.fullName}</p>
                  </Col>
                </Col>
                
                <Col md={8} className='mb-3'>
                  <ChangePasswordForm data={data}/>
                </Col>
              </Row>
            )}
            
            {loader && <FadeSpinLoader loading={loader}/>}
          </Card.Body>
        </Card>
      </Col>
    </ErrorBoundary>
  )
}

ProfilePasswordTab.propTypes = {
  err: PropTypes.bool,
  data: PropTypes.any,
  loader: PropTypes.bool,
}
