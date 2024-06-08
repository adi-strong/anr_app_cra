import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Button, Form, InputGroup} from "react-bootstrap";

export default function NewsFilesComponent({files, loader, onFileChange, onAddFileItem, onRemoveFileItem}) {
  return (
    <ErrorBoundary fallback={FallBackRender}>
      {files && files.length > 0 && files.map((file, index) => (
        <InputGroup key={index} className='mb-2'>
          <Form.Control
            accept='.pdf, .doc, .docx, .xls, .xls'
            type='file'
            name='item'
            onChange={e => onFileChange(e, index)}
          />
          <Button
            disabled={loader}
            type='button'
            variant='danger'
            onClick={() => onRemoveFileItem(index)}>
            <i className='bi bi-trash' />
          </Button>
        </InputGroup>
      ))}
      
      <Button
        disabled={loader}
        type='button'
        variant='secondary'
        className='d-block w-100 mb-2'
        onClick={onAddFileItem}>
        <i className='bi bi-file-earmark-plus'/> Ajouter un document
      </Button>
    </ErrorBoundary>
  )
}
