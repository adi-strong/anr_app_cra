import {ErrorBoundary} from "react-error-boundary";
import {FeedbackError, FallBackRender, FieldsAlert} from "../../../components";
import PropTypes from "prop-types";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {useState} from "react";
import {onPatientReset, onPatientSubmit, patientErrors, patientFields} from "../model/patients.service";
import {onFieldChange} from "../../../services/form.handler.service";
import {maritalStatusOptions, sexOptions} from "../../../services";
import AddPatientImageField from "./addPatientImageField";

export default function PatientForm({data, loader = false}) {
  const [validated, setValidated] = useState(false)
  const [fields, setFields] = useState(patientFields)
  const [errors, setErrors] = useState(patientErrors)
  
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
                
                <div className='mb-3'>
                  <Form.Label>Lieu & Date de naissance</Form.Label>
                  <InputGroup>
                    <Form.Control
                      isInvalid={errors.birthPlace !== null}
                      disabled={false}
                      autoComplete='off'
                      id='birthPlace'
                      name='birthPlace'
                      placeholder='Lieu de naissance'
                      value={fields.birthPlace}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    
                    <Form.Control
                      isInvalid={errors.birthDate !== null}
                      disabled={false}
                      type='date'
                      id='birthDate'
                      name='birthDate'
                      placeholder='Lieu de naissance'
                      value={fields.birthPlace}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                  </InputGroup>
                  <FeedbackError error={errors.birthPlace}/>
                  <FeedbackError error={errors.birthDate}/>
                </div>
                
                <div className='mb-3'>
                  <Form.Label htmlFor='nationality'>Nationalité</Form.Label>
                  <Form.Control
                    isInvalid={errors.nationality !== null}
                    disabled={false}
                    autoComplete='off'
                    id='nationality'
                    name='nationality'
                    value={fields.nationality}
                    onChange={e => onFieldChange(e, fields, setFields)}/>
                  <FeedbackError error={errors.nationality}/>
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
              <Form.Label htmlFor='father'>Nom du Père</Form.Label>
              <Form.Control
                isInvalid={errors.father !== null}
                disabled={false}
                autoComplete='off'
                id='father'
                name='father'
                value={fields.father}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.father}/>
            </div>
            
            <div className='mb-3'>
              <Form.Label htmlFor='mother'>Nom de la Mère</Form.Label>
              <Form.Control
                isInvalid={errors.mother !== null}
                disabled={false}
                autoComplete='off'
                id='mother'
                name='mother'
                value={fields.mother}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.mother}/>
            </div>
            
            <div className='mb-3'>
              <Form.Label htmlFor='mother'>Convention</Form.Label>
            </div>
            
            <div className='mb-3'>
              <Form.Label htmlFor='address'>Adresse</Form.Label>
              <Form.Control
                isInvalid={errors.mother !== null}
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

PatientForm.propTypes = {
  data: PropTypes.any,
  loader: PropTypes.bool,
}
