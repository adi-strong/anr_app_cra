import {ErrorBoundary} from "react-error-boundary";
import {DatePickerForm, FallBackRender, FieldsAlert, QuillEditor} from "../../../components";
import {Button, Form} from "react-bootstrap";
import PropTypes from "prop-types";
import {useState} from "react";
import {onDatePickerChange} from "../../../services/form.handler.service";

const fields = { releasedAt: new Date(), content: '' }

export default function EditNursingForm({onHide}) {
  const [treatment, setTreatment] = useState(fields)
  const [contentDraft, setContentDraft] = useState('')
  
  function onContentChange(value) {
    const content = value
    setContentDraft(value)
    setTreatment({...treatment, content})
  }
  
  const onContentBlur = () => setTreatment({...treatment, content: contentDraft})
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form onSubmit={e => e.preventDefault()}>
        <FieldsAlert/>
        
        <div className='mb-3'>
          <Form.Label><code>*</code> Date</Form.Label> <br/>
          <DatePickerForm
            isRequired
            label={null}
            date={fields.releasedAt}
            onChange={e => onDatePickerChange(e, 'releasedAt', treatment, setTreatment)}
            name='releasedAt'/>
        </div>
        
        <QuillEditor
          label='Observation(s)'
          value={treatment.content}
          onBlur={onContentBlur}
          onChange={onContentChange}/> <hr/>
        
        
        <Button disabled={false} type='submit' className='d-block w-100'>
          Valider
        </Button>
      </Form>
    </ErrorBoundary>
  )
}

EditNursingForm.propTypes = { onHide: PropTypes.func.isRequired }
