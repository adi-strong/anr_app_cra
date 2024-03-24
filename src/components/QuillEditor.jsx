import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "./index";
import 'react-quill/dist/quill.snow.css';
import ReactQuill from "react-quill";
import {Form} from "react-bootstrap";
import PropTypes from "prop-types";

export default function QuillEditor({label, value, error, onChange, onBlur}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form.Group className='mb-3'>
        {label && <Form.Label>{label}</Form.Label>}
        <ReactQuill
          theme='snow'
          value={value}
          onChange={onChange}
          onBlur={onBlur}/>
        {error && <div><code><i className='bi bi-exclamation-circle-fill'/> {error}</code></div>}
      </Form.Group>
    </ErrorBoundary>
  )
}

QuillEditor.propTypes = {
  label: PropTypes.string,
  error: PropTypes.any,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
}
