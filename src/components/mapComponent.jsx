import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "./index";
import PropTypes from "prop-types";

export default function MapComponent({longitude, latitude}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <iframe
        src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63650.835904311934!2d${longitude}!3d${latitude}8!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a6a487b40c0b8bf%3A0xfe2cdd3ac4fedbc5!2zQcOpcm9wb3J0IGRlIE7igJlkamlsaQ!5e0!3m2!1sfr!2scd!4v1712261095583!5m2!1sfr!2scd`}
        style={{ width: '100%', height: '100%' }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade" title='Map'></iframe>
    </ErrorBoundary>
  )
}

MapComponent.propTypes = {
  longitude: PropTypes.string.isRequired,
  latitude: PropTypes.string.isRequired
}
