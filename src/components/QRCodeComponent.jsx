import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "./index";
import {QRCodeCanvas} from "qrcode.react";
import PropTypes from "prop-types";

export default function QRCodeComponent({value}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <QRCodeCanvas value={value}/>
    </ErrorBoundary>
  )
}

QRCodeComponent.propTypes = {value: PropTypes.string.isRequired}
