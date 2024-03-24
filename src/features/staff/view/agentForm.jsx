import {ErrorBoundary} from "react-error-boundary";
import {FeedbackError, FallBackRender, FieldsAlert} from "../../../components";
import PropTypes from "prop-types";
import {Button, Col, Form, Row} from "react-bootstrap";
import {useState} from "react";
import {onFieldChange} from "../../../services/form.handler.service";
import {maritalStatusOptions, sexOptions} from "../../../services";
import {onPatientReset, onPatientSubmit} from "../../patients/model/patients.service";
import AddPatientImageField from "../../patients/view/addPatientImageField";
import {agentErrors, agentFields} from "../model/agent.service";

export default function AgentForm({data, loader = false}) {
  const [validated, setValidated] = useState(false)
  const [fields, setFields] = useState(agentFields)
  const [errors, setErrors] = useState(agentErrors)
  
  const onImageChange = (imageList, addUpdateIndex) => {
    setFields({...fields, file: imageList})
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <h4 className="card-title">
        <i className='bi bi-person-plus'/> Formulaire d'enregistrement
      </h4>
      
      <FieldsAlert/>
      
      <Form
        noValidate
        validated={validated}
        onSubmit={e => onPatientSubmit(
          e,
          fields,
          setFields,
          errors,
          setErrors,
          setValidated
        )}>
        <Row>
          <Col>
            <Row>
              <Col md={4}>
                {!data && <AddPatientImageField images={fields.file} onChange={onImageChange}/>}
              </Col>
              
              <Col md={8}>
                <div className='mb-3'>
                  <Form.Label htmlFor='name'><code>*</code> Nom</Form.Label>
                  <Form.Control
                    required
                    autoFocus
                    isInvalid={errors.name !== null}
                    disabled={false}
                    autoComplete='off'
                    id='name'
                    name='name'
                    value={fields.name}
                    onChange={e => onFieldChange(e, fields, setFields)}/>
                  <FeedbackError error={errors.name}/>
                </div>
                
                <div className='mb-3'>
                  <Form.Label htmlFor='lastName'>Postnom</Form.Label>
                  <Form.Control
                    isInvalid={errors.lastName !== null}
                    disabled={false}
                    autoComplete='off'
                    id='lastName'
                    name='lastName'
                    value={fields.lastName}
                    onChange={e => onFieldChange(e, fields, setFields)}/>
                  <FeedbackError error={errors.lastName}/>
                </div>
                
                <div className='mb-3'>
                  <Form.Label htmlFor='firstName'>Prénom</Form.Label>
                  <Form.Control
                    isInvalid={errors.firstName !== null}
                    disabled={false}
                    autoComplete='off'
                    id='firstName'
                    name='firstName'
                    value={fields.firstName}
                    onChange={e => onFieldChange(e, fields, setFields)}/>
                  <FeedbackError error={errors.firstName}/>
                </div>
                
                <div className='mb-3'>
                  <Form.Label htmlFor='sex'><code>*</code> Sexe</Form.Label>
                  <Form.Select
                    required
                    isInvalid={errors.sex !== null}
                    disabled={false}
                    autoComplete='off'
                    id='sex'
                    name='sex'
                    value={fields.sex}
                    onChange={e => onFieldChange(e, fields, setFields)}>
                    {sexOptions.length > 0 && sexOptions.map(s =>
                      <option key={s.value} value={s.value}>{s.label}</option>)}
                  </Form.Select>
                  <FeedbackError error={errors.sex}/>
                </div>
                
                <div className='mb-3'>
                  <Form.Label htmlFor='status'>État-civil</Form.Label>
                  <Form.Select
                    isInvalid={errors.status !== null}
                    disabled={false}
                    autoComplete='off'
                    id='status'
                    name='status'
                    value={fields.status}
                    onChange={e => onFieldChange(e, fields, setFields)}>
                    {maritalStatusOptions.length > 0 && maritalStatusOptions.map(s =>
                      <option key={s.value} value={s.value}>{s.label}</option>)}
                  </Form.Select>
                  <FeedbackError error={errors.status}/>
                </div>
              </Col>
            </Row>
          </Col>
          
          <Col>
            <div className='mb-3'>
              <Form.Label htmlFor='phone'>N° Tél</Form.Label>
              <Form.Control
                isInvalid={errors.phone !== null}
                disabled={false}
                autoComplete='off'
                id='phone'
                name='phone'
                value={fields.phone}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.phone}/>
            </div>
            
            <div className='mb-3'>
              <Form.Label htmlFor='email'>Email</Form.Label>
              <Form.Control
                isInvalid={errors.email !== null}
                disabled={false}
                autoComplete='off'
                type='email'
                id='email'
                name='email'
                value={fields.email}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.email}/>
            </div>
            
            <div className='mb-3'>
              <Form.Label htmlFor='department'>Département</Form.Label>
            </div>
            
            <div className='mb-3'>
              <Form.Label htmlFor='mother'>Service</Form.Label>
            </div>
            
            <div className='mb-3'>
              <Form.Label htmlFor='mother'>Grade</Form.Label>
            </div>
            
            <div className='mb-3'>
              <Form.Label htmlFor='mother'>Fonction</Form.Label>
            </div>
            
            <div className='mb-3'>
              <Form.Label htmlFor='address'>Adresse</Form.Label>
              <Form.Control
                isInvalid={errors.address !== null}
                disabled={false}
                autoComplete='off'
                as='textarea'
                id='address'
                name='address'
                placeholder='Adresse du malade...'
                value={fields.address}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.address}/>
            </div>
            
            <div className='text-end mt-9'>
              <Button
                disabled={false}
                type='button'
                variant='light'
                onClick={() => onPatientReset(setFields, setErrors)}
                className='me-1 mb-1'>
                <i className='bi bi-trash'/> Effacer
              </Button>
              
              <Button disabled={false} type='submit' className='mb-1'>
                Enregistrer
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </ErrorBoundary>
  )
}

AgentForm.propTypes = {
  data: PropTypes.any,
  loader: PropTypes.bool,
}
