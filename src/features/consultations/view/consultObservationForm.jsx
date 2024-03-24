import {ErrorBoundary} from "react-error-boundary";
import {DatePickerForm, FallBackRender, QuillEditor} from "../../../components";
import {Button, Card, Form} from "react-bootstrap";
import {useState} from "react";
import {onDatePickerChange} from "../../../services/form.handler.service";

export default function ConsultObservationForm() {
  const [fields, setFields] = useState({releasedAt: new Date(), content: '', isDone: false})
  const [contentDraft, setContentDraft] = useState('')
  
  function onContentChange(value) {
    const content = value
    setContentDraft(value)
    setFields({...fields, content})
  }
  
  const onContentBlur = () => setFields({...fields, content: contentDraft})
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Card className='mt-5'>
        <Card.Body>
          <h3 className='card-title text-primary text-uppercase'>Observations - traitements</h3>
          
          <Form onSubmit={e => e.preventDefault()}>
            <div className='mb-3'>
              <Form.Label htmlFor='releasedAt'><code>*</code> Date</Form.Label> <br/>
              <DatePickerForm
                isRequired
                label={null}
                date={fields.releasedAt}
                onChange={e => onDatePickerChange(e, 'releasedAt', fields, setFields)}
                name='releasedAt'/>
            </div>
            
            <QuillEditor
              label='Observation(s) / Commentaire(s)'
              value={fields.content}
              onBlur={onContentBlur}
              onChange={onContentChange}/>
            
            <Button disabled={false} type='submit' className='d-block w-100'>
              Valider
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </ErrorBoundary>
  )
}
