import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, QuillEditor} from "../../../components";
import PropTypes from "prop-types";
import {Button, Form, Modal, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useEditMedicalMutation} from "../../medical/model/medical.api.slice";
import toast from "react-hot-toast";
import {onFieldChange} from "../../../services/form.handler.service";

export default function EditMedicalFileModal({data, show, onHide, onRefres}) {
  const [fields, setFields] = useState({observation: '', file: ''})
  const [editMedical, {isLoading, isError, error}] = useEditMedicalMutation()
  const [draft, setDraft] = useState('')
  
  const onBlur = () => setFields({...fields, observation: draft})
  
  const onChange = observation => {
    setDraft(observation)
    setFields({...fields, observation})
  }
  
  const onSubmit = async () => {
    if (data) {
      const formData = new FormData()
      
      formData.append('medicalId', data.id)
      
      if (fields?.file) formData.append('file', fields.file)
      if (fields?.observation) formData.append('observation', fields.observation)
      
      try {
        const send = await editMedical(formData)
        if (send?.data) {
          toast.success('Opération bien efféctuée.')
          onHide()
          onRefres()
        }
      } catch (e) {
        toast.error('Problème de connexion.')
      }
    }
  }
  
  useEffect(() => {
    if (data) {
      const observation = data?.observation
      setDraft(observation)
      setFields(s => ({...s, observation}))
    }
  }, [data])
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header className='bg-primary' closeButton>
          <Modal.Title className='text-light'>
            <i className='bi bi-pencil-square'/> Avis / Observation(s)
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <div className='mb-3'>
            <Form.Label htmlFor='file'>Fiche médicale</Form.Label>
            <Form.Text className='mx-1'>(Fichier à attacher)</Form.Text>
            <Form.Control
              disabled={isLoading}
              type='file'
              id='file'
              name='file'
              onChange={e => onFieldChange(e, fields, setFields)}/>
          </div>
          
          <div className='mb-3'>
            <Form.Label>Avis / Observation</Form.Label>
            <QuillEditor onBlur={onBlur} onChange={onChange} value={fields.observation}/>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button disabled={isLoading} onClick={onHide} variant='light'>
            <i className='bi bi-x me-1'/>
            Annuler
          </Button>
          
          <Button disabled={isLoading} onClick={onSubmit}>
            {!isLoading && <i className='bi bi-check me-1'/>}
            {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
            {isLoading ? 'Veuillez patienter' : 'Valider'}
          </Button>
        </Modal.Footer>
      </Modal>
    </ErrorBoundary>
  )
}

EditMedicalFileModal.propTypes = {
  data: PropTypes.any,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onRefres: PropTypes.func.isRequired,
}
