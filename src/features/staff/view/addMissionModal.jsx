import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert, QuillEditor, ReactSelectField} from "../../../components";
import PropTypes from "prop-types";
import {Button, Col, Form, Modal, Row, Spinner} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import {missionErrors, missionFields} from "../model/mission.service";
import {onFieldChange} from "../../../services/form.handler.service";
import {useSelector} from "react-redux";
import {useGetAgentsListQuery, useLazyGetLoadAgentsQuery} from "../model/agent.api.slice";
import toast from "react-hot-toast";
import {usePostNewMissionMutation} from "../model/mission.api.service";

export default function AddMissionModal({show, onHide, agent, onRefresh}) {
  const [open, setOpen] = useState(false)
  const [fields, setFields] = useState(missionFields)
  const [errors, setErrors] = useState(missionErrors)
  const [draft, setDraft] = useState('')
  const [getLoadAgents] = useLazyGetLoadAgentsQuery()
  const [postNewMission, {isLoading, isError, error}] = usePostNewMissionMutation()
  
  const {nbPages} = useSelector(state => state.config)
  const {data: agents=[], isError: isAgentError, isLoading: isAgentLoading} = useGetAgentsListQuery(nbPages)
  
  let agentOptions
  agentOptions = useMemo(() => {
    let obj = []
    if (!isAgentError && agents.length > 0) obj = agents.map(p => ({
      label: p?.name?.toUpperCase()+' '+(p?.firstName ? p.firstName.toUpperCase()+' ' : ''),
      value: `/api/agents/${p.id}`,
      province: p?.province,
      department: p?.department,
      grade: p?.grade,
      service: p?.service,
      job: p?.job,
    }))
    
    return obj
  }, [agents, isAgentError])
  
  const toggleOpen = () => setOpen(!open)
  
  const onReset = () => {
    setErrors(missionErrors)
    setFields(missionFields)
  }
  
  const onDescChange = observation => {
    setDraft(observation)
    setFields({...fields, observation})
  }
  
  const onBlur = () => setFields({...fields, observation: draft})
  
  async function onLoadAgents(keywords) {
    try {
      const search = await getLoadAgents(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onSubmit = async () => {
    setErrors(missionErrors)
    try {
      const formData = new FormData()
      
      formData.append('object', fields.object)
      formData.append('place', fields.place)
      formData.append('transport', fields.transport)
      
      if (fields?.members && fields.members?.length > 0) {
        const members = fields.members?.map(m => m?.value)
        formData.append('members', JSON.stringify(members))
      }
      
      if (agent) formData.append('agent', agent['@id'])
      if (fields?.startAt) formData.append('startAt', fields.startAt)
      if (fields?.endAt) formData.append('endAt', fields.endAt)
      if (fields?.transportName) formData.append('transportName', fields.transportName)
      if (fields?.ticketNumber) formData.append('ticketNumber', fields.ticketNumber)
      if (fields?.accommodation) formData.append('accommodation', fields.accommodation)
      if (fields?.accommodationAddress) formData.append('accommodationAddress', fields.accommodationAddress)
      if (fields?.observation) formData.append('observation', fields.observation)
      if (fields?.roadmapFile) formData.append('roadmapFile', fields.roadmapFile)
      if (fields?.exitPermitFile) formData.append('exitPermitFile', fields.exitPermitFile)
      if (fields?.missionOrderFile) formData.append('missionOrderFile', fields.missionOrderFile)
      
      const send = await postNewMission(formData)
      if (send?.data) {
        toast.success('Opération bien efféctuée.')
        onReset()
        setOpen(false)
        onRefresh()
        onHide()
      }
      else { setOpen(false) }
    }
    catch (e) { toast.error('Problème de connexion.') }
  }
  
  useEffect(() => {
    if (isError) {
      const desc = error?.data && error.data['hydra:description']
      if (desc) {
        const hydraDescriptions = desc?.split(':')
        for (const key in hydraDescriptions) {
          const propertyPath = hydraDescriptions[key]
          const message = hydraDescriptions[1]
          setErrors(s => ({...s, [propertyPath]: message}))
        }
      }
      
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
          <Modal.Title><i className='bi bi-plus'/> Nouvelle mission</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <FieldsAlert/>
          
          <Row>
            <Col className='mb-3'>
              <Form.Label htmlFor='object'><code>*</code> Objet</Form.Label>
              <Form.Control
                autoFocus
                isInvalid={errors.object !== null}
                disabled={isLoading}
                autoComplete='off'
                id='object'
                name='object'
                value={fields.object}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.object}/>
            </Col>
            
            <Col className='mb-3'>
              <Form.Label htmlFor='place'><code>*</code> Lieu</Form.Label>
              <Form.Control
                isInvalid={errors.place !== null}
                disabled={isLoading}
                autoComplete='off'
                id='place'
                name='place'
                value={fields.place}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.place}/>
            </Col>
          </Row>
          
          <div className='mb-3'>
            <Form.Label>Membre(s) de la mission :</Form.Label>
            <ReactSelectField
              isAsync
              isMulti
              disabled={isAgentLoading || isLoading}
              value={fields.members}
              onChange={e => setFields({...fields, members: e})}
              onLoadOptions={onLoadAgents}
              placeholder='-- --'
              values={agentOptions}/>
          </div>
          
          <Row>
            <Col className='mb-3'>
              <Form.Label htmlFor='startAt'><code>*</code> Date de début</Form.Label>
              <Form.Control
                isInvalid={errors.startAt !== null}
                disabled={isLoading}
                autoComplete='off'
                type='date'
                id='startAt'
                name='startAt'
                value={fields.startAt}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.startAt}/>
            </Col>
            
            <Col className='mb-3'>
              <Form.Label htmlFor='endAt'><code>*</code> Date de fin</Form.Label>
              <Form.Control
                isInvalid={errors.endAt !== null}
                disabled={isLoading}
                autoComplete='off'
                type='date'
                id='endAt'
                name='endAt'
                value={fields.endAt}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.endAt}/>
            </Col>
          </Row>
          
          <Row>
            <Col className='mb-3'>
              <Form.Label htmlFor='roadmapFile'><code>*</code> Feuille de route</Form.Label>
              <Form.Control
                isInvalid={errors.roadmapFile !== null}
                disabled={isLoading}
                type='file'
                autoComplete='off'
                accept='.pdf, .doc, .docx, .xls, .xls'
                id='roadmapFile'
                name='roadmapFile'
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors?.roadmapFile}/>
            </Col>
            
            <Col className='mb-3'>
              <Form.Label htmlFor='missionOrderFile'><code>*</code> Ordre de mission</Form.Label>
              <Form.Control
                isInvalid={errors.missionOrderFile !== null}
                disabled={isLoading}
                type='file'
                autoComplete='off'
                accept='.pdf, .doc, .docx, .xls, .xls'
                id='missionOrderFile'
                name='missionOrderFile'
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.missionOrderFile}/>
            </Col>
            
            <Col className='mb-3'>
              <Form.Label htmlFor='exitPermitFile'><code>*</code> Autorisation de sortie</Form.Label>
              <Form.Control
                isInvalid={errors.exitPermitFile !== null}
                disabled={isLoading}
                type='file'
                autoComplete='off'
                accept='.pdf, .doc, .docx, .xls, .xls'
                id='exitPermitFile'
                name='exitPermitFile'
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.exitPermitFile}/>
            </Col>
          </Row>
          
          <Row>
            <Col className='mb-3'>
              <Form.Label htmlFor='transport'><code>*</code> Moyen de transport</Form.Label>
              <Form.Control
                isInvalid={errors.startAt !== null}
                disabled={isLoading}
                autoComplete='off'
                id='transport'
                name='transport'
                placeholder='Exemple : Aérien | Routier | Etc.'
                value={fields.transport}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.transport}/>
            </Col>
            
            <Col className='mb-3'>
              <Form.Label htmlFor='transportName'>Marque / Nom du moyen de transport</Form.Label>
              <Form.Control
                isInvalid={errors.startAt !== null}
                disabled={isLoading}
                autoComplete='off'
                id='transportName'
                name='transportName'
                placeholder='Exemple : Air Congo...'
                value={fields.transportName}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.transportName}/>
            </Col>
          </Row>
          
          <Row>
            <Col className='mb-3'>
              <Form.Label htmlFor='ticketNumber'>N° de billet</Form.Label>
              <Form.Control
                isInvalid={errors.ticketNumber !== null}
                disabled={isLoading}
                autoComplete='off'
                id='ticketNumber'
                name='ticketNumber'
                value={fields.ticketNumber}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.ticketNumber}/>
            </Col>
            
            <Col className='mb-3'>
              <Form.Label htmlFor='accommodation'>Logement</Form.Label>
              <Form.Control
                isInvalid={errors.accommodation !== null}
                disabled={isLoading}
                autoComplete='off'
                id='accommodation'
                name='accommodation'
                value={fields.accommodation}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.accommodation}/>
            </Col>
          </Row>
          
          <div className='mb-3'>
            <Form.Label htmlFor='accommodationAddress'>Adresse du logement</Form.Label>
            <Form.Control
              isInvalid={errors.accommodationAddress !== null}
              disabled={isLoading}
              as='textarea'
              autoComplete='off'
              placeholder='Exemple : 56 Av Makoso / C. Nzadi, ...'
              id='accommodationAddress'
              name='accommodationAddress'
              value={fields.accommodationAddress}
              onChange={e => onFieldChange(e, fields, setFields)}/>
            <FeedbackError error={errors.accommodationAddress}/>
          </div>
          
          <div>
            <Form.Label>Description de la mission :</Form.Label>
            <QuillEditor
              onBlur={onBlur}
              onChange={onDescChange}
              value={fields.observation}/>
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

AddMissionModal.propTypes = {
  agent: PropTypes.any,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
}
