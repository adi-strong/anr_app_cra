import {useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {DatePickerForm, FallBackRender, FeedbackError, FieldsAlert} from "../../../components";
import {Button, Form} from "react-bootstrap";
import PropTypes from "prop-types";
import {rdvErrors, rdvFields} from "../model/rendez.vous.service";
import {onDatePickerChange, onFieldChange} from "../../../services/form.handler.service";

export default function RdvFileForm({onHide}) {
  const [validated/*, setValidated*/] = useState(false)
  const [fields, setFields] = useState(rdvFields)
  const [errors/*, setErrors*/] = useState(rdvErrors)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <FieldsAlert/>
      
      <Form
        noValidate
        validated={validated}
        onSubmit={e => {}}>
        
        <div className='mb-3'>
          <Form.Switch
            disabled={false}
            id='thePatient'
            type='checkbox'
            className='mb-2'
            label={<>Malade / Patient(e) <code>*</code></>}
            name='isSelected'
            value={fields.isSelected}
            checked={fields.isSelected}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          
          {!fields.isSelected &&
            <Form.Control
              required
              autoFocus
              id='thePatient'
              disabled={false}
              autoComplete='off'
              isInvalid={errors.thePatient !== null}
              name='name'
              value={fields.thePatient}
              onChange={e => onFieldChange(e, fields, setFields)}/>}
          
          <FeedbackError error={errors.thePatient}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='reason'>Motif</Form.Label>
          <Form.Control
            id='reason'
            disabled={false}
            autoComplete='off'
            isInvalid={errors.reason !== null}
            name='reason'
            value={fields.reason}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.reason}/>
        </div>
        
        <div>
          <DatePickerForm
            date={fields.releasedAt}
            onChange={e => onDatePickerChange(e, 'releasedAt', fields, setFields)}
            name='releasedAt'/>
        </div> <hr/>
        
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

RdvFileForm.propTypes = { onHide: PropTypes.func.isRequired }
