import {useEffect, useState} from "react";
import {salaryErrors} from "../../salaries/model/salary.service";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, QuillEditor} from "../../../components";
import {Button, Form, Modal, Spinner} from "react-bootstrap";
import PropTypes from "prop-types";
import {medicalErrors, medicalFields} from "../model/medical.service";
import {usePostNewMedicalMutation} from "../model/medical.api.slice";
import {onFieldChange} from "../../../services/form.handler.service";
import toast from "react-hot-toast";

export default function AddMedicalModal({show, onHide, agent, onRefresh}) {
  const [open, setOpen] = useState(false)
  const [fields, setFields] = useState(medicalFields)
  const [errors, setErrors] = useState(medicalErrors)
  const [postNewMedical, {isLoading, isError, error}] = usePostNewMedicalMutation()
  const [draft, setDraft] = useState('')
  
  const toggleOpen = () => setOpen(!open)
  
  const onReset = () => {
    setErrors(medicalErrors)
    setFields(medicalFields)
  }
  
  const onBlur = () => setFields({...fields, observation: draft})
  
  const onObsChange = observation => {
    setDraft(observation)
    setFields({...fields, observation})
  }
  
  const onSubmit = async () => {
    setErrors(salaryErrors)
    if (agent) {
      const formData = new FormData()
      formData.append('agent', agent['@id'])
      if (fields?.file) formData.append('file', fields.file)
      if (fields?.observation) formData.append('observation', fields.observation)
      
      try {
        const send = await postNewMedical(formData)
        if (send?.data) {
          toast.success('Opération bien efféctuée.')
          onReset()
          onHide()
          onRefresh()
        }
      }
      catch (e) { toast.error('Problème de connexion.') }
    }
  }
  
  useEffect(() => {
    if (isError) {
      const {violations} = error?.data
      if (violations) violations.forEach(({ propertyPath, message }) => {
        setErrors(s => ({...s, [propertyPath]: message}))
      })
    }
  }, [isError, error])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header className='bg-light' closeButton>
          <Modal.Title><i className='bi bi-plus'/> Nouvelle fiche</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form.Group className='mb-3'>
            <Form.Label htmlFor='file'><code>*</code> Fiche</Form.Label>
            <Form.Text className='mx-1'>(fichier à insérer)</Form.Text>
            <Form.Control
              disabled={isLoading}
              type='file'
              accept='.doc, .docx, .pdf, .xls, .xlsx'
              name='file'
              onChange={e => onFieldChange(e, fields, setFields)}/>
            <FeedbackError error={errors.file}/>
          </Form.Group>
          
          <div>
            <Form.Label>Avis / Observation</Form.Label>
            <QuillEditor onBlur={onBlur} onChange={onObsChange} value={fields.observation}/>
          </div>
        </Modal.Body>
        
        <Modal.Footer className='bg-light'>
          {open && (
            <>
              <Button disabled={isLoading} variant='dark' onClick={toggleOpen}>
                <i className='bi bi-x'/> Annuler
              </Button>
              
              <Button disabled={isLoading} variant='outline-success' onClick={onSubmit}>
                {!isLoading && <i className='bi bi-exclamation-circle-fill me-1'/>}
                {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
                {isLoading ? 'Veuillez patienter' : 'Valider'}
              </Button>
            </>
          )}
          
          {!open && (
            <>
              <Button disabled={isLoading} variant='secondary' onClick={onHide}>
                <i className='bi bi-x'/> Fermer
              </Button>
              
              <Button disabled={isLoading} onClick={toggleOpen}>
                Créer
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </ErrorBoundary>
  )
}

AddMedicalModal.propTypes = {
  agent: PropTypes.any,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
}
