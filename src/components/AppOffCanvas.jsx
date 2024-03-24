import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "./index";
import PropTypes from "prop-types";
import {Offcanvas} from "react-bootstrap";

export default function AppOffCanvas({show, onHide, title, children, placement = 'end'}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Offcanvas show={show} onHide={onHide} placement={placement}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className='text-uppercase'>{title}</Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body>{children}</Offcanvas.Body>
      </Offcanvas>
    </ErrorBoundary>
  )
}

AppOffCanvas.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  placement: PropTypes.string,
  title: PropTypes.any,
}
