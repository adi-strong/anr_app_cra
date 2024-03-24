import {ErrorBoundary} from "react-error-boundary";
import {DatePickerForm, FallBackRender, FeedbackError, FieldsAlert} from "../../../components";
import {Button, Form} from "react-bootstrap";
import PropTypes from "prop-types";
import {onDatePickerChange} from "../../../services/form.handler.service";
import {useState} from "react";
import {nursingErrors, nursingFields} from "../model/nursing.service";

export default function NewTreatmentForm({onHide}) {
  const [fields, setFields] = useState(nursingFields)
  const [errors/*, setErrors*/] = useState(nursingErrors)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form onSubmit={e => e.preventDefault()}>
        <FieldsAlert/>
        
        <div className='mb-3'>
          <Form.Label htmlFor='releasedAt'>Date</Form.Label> <br/>
          <DatePickerForm
            label={null}
            date={fields.releasedAt}
            onChange={e => onDatePickerChange(e, 'releasedAt', fields, setFields)}
            name='releasedAt'/>
        </div>
        
        <div className='mb-3'>
          <Form.Label><code>*</code> Fiche</Form.Label>
          <FeedbackError error={errors.consultation}/>
        </div>
        
        <div>
          <Form.Label><code>*</code> Patient(e)</Form.Label>
          <FeedbackError error={errors.patient}/>
        </div>
        
        <hr/>
        <div className='text-end'>
          <Button disabled={false} type='button' variant='light' className='me-1'>
            <i className='bi bi-trash'/> Effacer
          </Button>
          
          <Button disabled={false} type='submit'>
            <i className='bi bi-check'/> Valider
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}

NewTreatmentForm.propTypes = { onHide: PropTypes.func.isRequired }
