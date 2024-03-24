import {useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert} from "../../../components";
import {Button, Form} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import PropTypes from "prop-types";
import {covContractErrors, covContractFields} from "../model/covenant.service";

export default function CovenantContractForm({onHide}) {
  const [validated/*, setValidated*/] = useState(false)
  const [fields, setFields] = useState(covContractFields)
  const [errors/*, setErrors*/] = useState(covContractErrors)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form
        noValidate
        validated={validated}
        onSubmit={e => {}}>
        <FieldsAlert/>
        
        <div className='mb-3'>
          <Form.Label htmlFor='startAt'><code>*</code> Début</Form.Label>
          <Form.Control
            required
            id='startAt'
            type='date'
            disabled={false}
            autoComplete='off'
            isInvalid={errors.startAt !== null}
            name='startAt'
            value={fields.startAt}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.startAt}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='endAt'><code>*</code> Fin</Form.Label>
          <Form.Control
            required
            id='endAt'
            type='date'
            disabled={false}
            autoComplete='off'
            isInvalid={errors.endAt !== null}
            name='endAt'
            value={fields.endAt}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.endAt}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='file'>
            <code>*</code> Fichier du contrat <i className='bi bi-paperclip'/>
          </Form.Label>
          <Form.Control
            required
            id='file'
            type='file'
            accept='.pdf, .doc, .docx, .xls, .xlsx'
            disabled={false}
            autoComplete='off'
            isInvalid={errors.file !== null}
            name='file'
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.file}/>
        </div>
        
        <hr/>
        <div className='text-end'>
          <Button
            type='button'
            variant='light'
            className='me-1 mb-1'
            onClick={() => {}}
            disabled={false}>
            <i className='bi bi-trash'/> Effacer
          </Button>
          
          <Button type='submit' disabled={false} className='mb-1'>
            Enregistrer
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}

CovenantContractForm.propTypes = { onHide: PropTypes.func.isRequired }
