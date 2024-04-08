import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, QuillEditor} from "../../../components";
import {Button, Modal, Spinner} from "react-bootstrap";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import {useEditMissionMutation} from "../model/mission.api.service";
import toast from "react-hot-toast";

export default function EditMissionObservationModal({show, onHide, onRefresh, data}) {
  const [fields, setFields] = useState({observation: ''})
  const [draft, setDraft] = useState('')
  const [editMission, {isError, error, isLoading}] = useEditMissionMutation()
  
  const onBlur = () => setFields({...fields, observation: draft})
  
  const onChange = observation => {
    setDraft(observation)
    setFields(s => ({...s, observation}))
  }
  
  useEffect(() => {
    if (data) {
      const observation = data?.observation
      setDraft(observation)
      setFields(s => ({...s, id: data.id, observation}))
    }
  }, [data])
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error?.error)
      if (error?.data && error.data['hydra:description']) toast.error(error?.data['hydra:description'])
    }
  }, [isError, error])
  
  const onSubmit = async () => {
    if (data) {
      try {
        const send = await editMission(fields)
        if (send?.data) {
          toast.success('Opération bien efféctuée.')
          onHide()
          onRefresh()
        }
      } catch (e) {
        toast.error('Problème de connexion.')
      }
    }
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header className='bg-primary' closeButton>
          <Modal.Title className='text-white'>
            <i className='bi bi-pencil-square'/> Observation de la mission
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <QuillEditor onBlur={onBlur} onChange={onChange} value={fields.observation}/>
        </Modal.Body>
        
        <Modal.Footer>
          <Button disabled={isLoading} onClick={onHide} variant='light'>
            <i className='bi bi-x'/> Annuler
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

EditMissionObservationModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
  data: PropTypes.any
}
