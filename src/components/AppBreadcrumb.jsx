import PropTypes from "prop-types";
import {Col, Row} from "react-bootstrap";

export default function AppBreadcrumb({title, subTitle}) {
  return (
    <Row>
      <Col lg={12} md={12}>
        <div className='border-bottom pb-4 mb-4'>
          <h3 className="mb-0 fw-bold">{title}</h3>
          <span>{subTitle}</span>
        </div>
      </Col>
    </Row>
  )
}

AppBreadcrumb.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string,
}
