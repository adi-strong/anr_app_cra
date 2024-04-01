import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert, ReactSelectField} from "../../../components";
import {useEffect, useMemo, useState} from "react";
import {recoveryErrors, recoveryFields} from "../model/recovery.service";
import {Button, Card, Col, Form, Modal, Row, Spinner} from "react-bootstrap";
import {useGetProvincesListQuery, useLazyGetLoadProvincesQuery} from "../../configurations/model/province.api.slice";
import {useSelector} from "react-redux";
import {useGetAgentsListQuery, useLazyGetLoadAgentsQuery} from "../../staff/model/agent.api.slice";
import toast from "react-hot-toast";
import {onFieldChange} from "../../../services/form.handler.service";
import {usePostNewRecoveryMutation} from "../model/recovery.api.slice";
import {useNavigate} from "react-router-dom";

function ConfirmModal({show, onHide, onSubmit}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Modal show={show} onHide={onHide}>
        <Modal.Header className='bg-warning' closeButton>
          <Modal.Title><i className='bi bi-exclamation-circle-fill'/> Confirmation</Modal.Title>
        </Modal.Header>
        
        <Modal.Body className='text-center'>
          <small><code><i className='bi bi-exclamation-triangle-fill'/> Cette action est irréversible.</code></small>
          <p>Veuillez confirmer cette opération</p>
        </Modal.Body>
        
        <Modal.Footer>
          <Button type='button' variant='light' onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          <Button autoFocus type='button' variant='warning' onClick={onSubmit}>
            <i className='bi bi-check'/> Valider
          </Button>
        </Modal.Footer>
      </Modal>
    </ErrorBoundary>
  )
}

export default function RecoveryForm() {
  const [fields, setFields] = useState(recoveryFields)
  const [errors, setErrors] = useState(recoveryErrors)
  const [show, setShow] = useState(false)
  const [getLoadProvinces] = useLazyGetLoadProvincesQuery()
  const [getLoadAgents] = useLazyGetLoadAgentsQuery()
  const [postNewRecovery, {isLoading, isError, error}] = usePostNewRecoveryMutation()
  
  const {nbPages} = useSelector(state => state.config)
  const {data: provinces=[], isLoading: isPLoading, isError: isPError, error: pError}
    = useGetProvincesListQuery(nbPages)
  const {data: agents=[], isLoading: isALoading, isError: isAError, error: aError}
    = useGetAgentsListQuery(nbPages)
  
  const navigate = useNavigate()
  let provOptions, agentOptions, societyOptions
  
  provOptions = useMemo(() => {
    let obj = []
    if (!isPError && provinces.length > 0) {
      obj = provinces.map(p => ({
        label: p?.name?.toUpperCase(),
        value: p['@id'],
        societies: p?.societies && p.societies?.length > 0 ? p.societies : []
      }))
    }
    
    return obj
  }, [isPError, provinces])
  
  agentOptions = useMemo(() => {
    let obj = []
    if (!isAError && agents.length > 0) {
      obj = agents.map(p => ({
        label: p?.name?.toUpperCase()+' '+(p?.firstName ? p.firstName.toUpperCase()+' ' : ''),
        value: `/api/agents/${p.id}`,
      }))
    }
    
    return obj
  }, [isAError, agents])
  
  societyOptions = useMemo(() => {
    let obj = []
    if (fields?.province) {
      obj = fields.province.societies.map(s => (!s?.isDeleted) && ({
        label: s.name.toUpperCase(),
        value: s.name.toUpperCase(),
        data: s['@id'],
        type: s?.type ? s.type : null
      }))
    }
    
    return obj
  }, [fields])
  
  const toggleShow = () => setShow(!show)
  
  const onReset = (): void => {
    setErrors(recoveryErrors)
    setFields(recoveryFields)
  }
  
  async function onLoadProvinces(keywords) {
    try {
      const search = await getLoadProvinces(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  async function onLoadAgents(keywords) {
    try {
      const search = await getLoadAgents(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onProvinceChange = (e) => {
    const province = e
    const society = null
    const type = null
    
    setFields({...fields, society, type, province})
  }
  
  const onSocietyChange = (e) => {
    const society = e
    const type = society && society?.type ? {
      label: society.type.name.toUpperCase(),
      value: society.type['@id']
    } : null
    
    setFields({...fields, society, type})
  }
  
  const onSubmit = async (e): void => {
    e.preventDefault()
    setErrors(recoveryErrors)
    toggleShow()
    
    const formData = new FormData()
    if (fields?.agent) formData.append('agent', fields.agent?.value)
    if (fields?.type) formData.append('type', fields.type?.value)
    if (fields?.society) formData.append('society', fields.society?.data)
    if (fields?.province) formData.append('province', fields.province?.value)
    if (fields?.certificateFile) formData.append('certificateFile', fields.certificateFile)
    if (fields?.callingCardFile) formData.append('callingCardFile', fields.callingCardFile)
    if (fields?.pvFile) formData.append('pvFile', fields.pvFile)
    if (fields?.formFile) formData.append('formFile', fields.formFile)
    if (fields?.expenseReportFile) formData.append('expenseReportFile', fields.expenseReportFile)
    if (fields?.proofOfPaymentFile) formData.append('proofOfPaymentFile', fields.proofOfPaymentFile)
    
    try {
      const send = await postNewRecovery(formData)
      if (send?.data) {
        toast.success('Opération bien efféctuée.')
        onReset()
        navigate('/app/societies')
      }
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  useEffect(() => {
    if (isAError) {
      if (aError?.error) toast.error(aError.error)
      if (aError?.data && aError.data['hydra:description']) toast.error(aError.data['hydra:description'])
    }
    
    if (isPError) {
      if (pError?.error) toast.error(pError.error)
      if (pError?.data && pError.data['hydra:description']) toast.error(pError.data['hydra:description'])
    }
  }, [isAError, isPError, aError, pError]) // errors
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error]) // fields errors
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <FieldsAlert/>
      <h3 className='card-title mb-4'>Formuaire</h3>
      
      <Card>
        <Card.Body>
          <Row>
            <Col md={5} className='mb-3'>
              <div className='mb-3'>
                <Form.Label><code>*</code> Agent</Form.Label>
                <ReactSelectField
                  isAsync
                  disabled={isALoading || isLoading}
                  value={fields.agent}
                  onChange={e => setFields({...fields, agent: e})}
                  onLoadOptions={onLoadAgents}
                  values={agentOptions}
                  placeholder='-- --'/>
                {errors.agent && <code><i className='bi bi-exclamation-circle-fill'/> {errors.agent}</code>}
              </div>
              
              <div className='mb-3'>
                <Form.Label><code>*</code> Province</Form.Label>
                <ReactSelectField
                  isAsync
                  disabled={isPLoading || isLoading}
                  value={fields.province}
                  onChange={e => onProvinceChange(e)}
                  onLoadOptions={onLoadProvinces}
                  values={provOptions}
                  placeholder='-- --'/>
                {errors.province && <code><i className='bi bi-exclamation-circle-fill'/> {errors.province}</code>}
              </div>
              
              <div className='mb-3'>
                <Form.Label><code>*</code> Société</Form.Label>
                <ReactSelectField
                  disabled={!fields.province || isLoading}
                  value={fields.society}
                  onChange={e => onSocietyChange(e)}
                  values={societyOptions}
                  placeholder='-- --'/>
                {errors.society && <code><i className='bi bi-exclamation-circle-fill'/> {errors.society}</code>}
              </div>
              
              {fields?.society &&
                <div className='bg-light p-2' style={{ border: '1px solid lightgray', borderRadius: 6 }}>
                  <Card.Title className='mb-1'>Activité(s) : {fields?.type && fields.type?.label}</Card.Title>
                </div>}
            </Col>
            
            <Col md={7} className='mb-3 bg-light p-3'>
              <div className='mb-3'>
                <Form.Label htmlFor='certificateFile'><code>*</code> Homologation de sécurité</Form.Label>
                <Form.Control
                  isInvalid={errors.certificateFile !== null}
                  disabled={isLoading}
                  id='certificateFile'
                  name='certificateFile'
                  type='file'
                  accept='.doc, .pdf, .xls, .xlsx, .docs'
                  onChange={e => onFieldChange(e, fields, setFields)}/>
                <FeedbackError error={errors.certificateFile}/>
              </div>
              
              <div className='mb-3'>
                <Form.Label htmlFor='callingCardFile'><code>*</code> Avis de passage</Form.Label>
                <Form.Control
                  isInvalid={errors.callingCardFile !== null}
                  disabled={isLoading}
                  id='callingCardFile'
                  name='callingCardFile'
                  type='file'
                  accept='.doc, .pdf, .xls, .xlsx, .docs'
                  onChange={e => onFieldChange(e, fields, setFields)}/>
                <FeedbackError error={errors.callingCardFile}/>
              </div>
              
              <div className='mb-3'>
                <Form.Label htmlFor='pvFile'><code>*</code> PV</Form.Label>
                <Form.Control
                  isInvalid={errors.pvFile !== null}
                  disabled={isLoading}
                  id='pvFile'
                  name='pvFile'
                  type='file'
                  accept='.doc, .pdf, .xls, .xlsx, .docs'
                  onChange={e => onFieldChange(e, fields, setFields)}/>
                <FeedbackError error={errors.pvFile}/>
              </div>
              
              <div className='mb-3'>
                <Form.Label htmlFor='formFile'><code>*</code> Formulaire</Form.Label>
                <Form.Control
                  isInvalid={errors.formFile !== null}
                  disabled={isLoading}
                  id='formFile'
                  name='formFile'
                  type='file'
                  accept='.doc, .pdf, .xls, .xlsx, .docs'
                  onChange={e => onFieldChange(e, fields, setFields)}/>
                <FeedbackError error={errors.formFile}/>
              </div>
              
              <div className='mb-3'>
                <Form.Label htmlFor='expenseReportFile'><code>*</code> Note de frais</Form.Label>
                <Form.Control
                  isInvalid={errors.expenseReportFile !== null}
                  disabled={isLoading}
                  id='expenseReportFile'
                  name='expenseReportFile'
                  type='file'
                  accept='.doc, .pdf, .xls, .xlsx, .docs'
                  onChange={e => onFieldChange(e, fields, setFields)}/>
                <FeedbackError error={errors.expenseReportFile}/>
              </div>
              
              <div className='mb-3'>
                <Form.Label htmlFor='proofOfPaymentFile'><code>*</code> Preuve de paiement</Form.Label>
                <Form.Control
                  isInvalid={errors.proofOfPaymentFile !== null}
                  disabled={isLoading}
                  id='proofOfPaymentFile'
                  name='proofOfPaymentFile'
                  type='file'
                  accept='.doc, .pdf, .xls, .xlsx, .docs'
                  onChange={e => onFieldChange(e, fields, setFields)}/>
                <FeedbackError error={errors.proofOfPaymentFile}/>
              </div>
              <Button disabled={isLoading} className='d-block w-100' onClick={toggleShow}>
                {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
                {!isLoading && <i className='bi bi-check me-1'/>}
                {!isLoading ? 'Valider' : 'Veuillez patienter'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <ConfirmModal show={show} onHide={toggleShow} onSubmit={onSubmit}/>
    </ErrorBoundary>
  )
}
