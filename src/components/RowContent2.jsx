import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "./index";
import {Col} from "react-bootstrap";
import PropTypes from "prop-types";

export default function RowContent2({xxl=12, title, content}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Col xxl={xxl} className="mb-5">
        <h6 className="text-uppercase fs-5 ls-2">{title}</h6>
        <p className="mb-0">{content}</p>
      </Col>
    </ErrorBoundary>
  )
}

RowContent2.propTypes = {
  xxl: PropTypes.number,
  title: PropTypes.string.isRequired,
  content: PropTypes.any,
}
