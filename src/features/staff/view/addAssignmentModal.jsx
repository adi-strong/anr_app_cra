import {useEffect, useMemo, useState} from "react";
import {salaryErrors} from "../../salaries/model/salary.service";
import toast from "react-hot-toast";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FieldsAlert, ReactSelectField} from "../../../components";
import {Button, Card, Col, Form, Modal, Row, Spinner} from "react-bootstrap";
import PropTypes from "prop-types";
import {assignmentErrors, assignmentFields} from "../model/assignment.service";
import {usePostNewAssignmentMutation} from "../model/ass.api.slice";
import {useSelector} from "react-redux";
import {
  useGetDepartmentsListQuery,
  useLazyGetLoadDepartmentsQuery
} from "../../configurations/model/department.api.slice";
import {useGetProvincesListQuery, useLazyGetLoadProvincesQuery} from "../../configurations/model/province.api.slice";
import {onFieldChange} from "../../../services/form.handler.service";

export default function AddAssignmentModal({show, onHide, agent, onRefresh}) {
  const [open, setOpen] = useState(false)
  const [fields, setFields] = useState(assignmentFields)
  const [errors, setErrors] = useState(assignmentErrors)
  const [postNewAssignment, {isLoading, isError, error}] = usePostNewAssignmentMutation()
  const [getLoadDepartments] = useLazyGetLoadDepartmentsQuery()
  const [getLoadProvinces] = useLazyGetLoadProvincesQuery()
  const [isChecked, setIsChecked] = useState(false)
  
  const {nbPages} = useSelector(state => state.config)
  const {data: provinces=[], isError: isProvinceError, isLoading: isProvLoading} = useGetProvincesListQuery(nbPages)
  const {isError: isDepartmentError, data: departments=[], isLoading: isDepLoading}
    = useGetDepartmentsListQuery(nbPages)
  
  let depOptions, provOptions
  
  depOptions = useMemo(() => {
    let obj = []
    if (!isDepartmentError && departments.length > 0) {
      obj = departments.map(p => ({
        label: p?.name?.toUpperCase(),
        value: p['@id']
      }))
    }
    
    return obj
  }, [isDepartmentError, departments])
  
  provOptions = useMemo(() => {
    let obj = []
    if (!isProvinceError && provinces.length > 0) {
      obj = provinces.map(p => ({
        label: p?.name?.toUpperCase(),
        value: p['@id']
      }))
    }
    
    return obj
  }, [isProvinceError, provinces])
  
  const toggleIsChecked = () => {
    setIsChecked(!isChecked)
    setFields({...fields, startAt: '', endAt: ''})
  }
  
  const toggleOpen = () => setOpen(!open)
  
  const onReset = () => {
    setErrors(assignmentErrors)
    setFields(assignmentFields)
  }
  
  async function onLoadDepartments(keywords) {
    try {
      const search = await getLoadDepartments(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  async function onLoadProvinces(keywords) {
    try {
      const search = await getLoadProvinces(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onSubmit = async () => {
    setErrors(salaryErrors)
    if (agent) {
      if (!fields?.startAt && fields?.endAt) toast.error('Veuillez renseigner la date de début.');
      else {
        try {
          const send = await postNewAssignment({...fields, agent: agent['@id']})
          if (send?.data) {
            toast.success('Opération bien efféctuée.')
            onReset()
            setOpen(false)
            onHide()
            onRefresh()
          }
        }
        catch (e) { toast.error('Problème de connexion.') }
      }
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
          <Modal.Title><i className='bi bi-plus'/> Nouvelle affectation</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <FieldsAlert/>
          
          <Row>
            <Col className='mb-3'>
              <Form.Label><code>*</code> Province</Form.Label>
              <ReactSelectField
                isAsync
                disabled={isLoading || isProvLoading}
                value={fields.province}
                onChange={e => setFields({...fields, province: e})}
                values={provOptions}
                onLoadOptions={onLoadProvinces}
                placeholder='-- --'/>
              {errors?.province && <code><i className='bi bi-exclamation-circle-fill'/> {errors.province}</code>}
            </Col>
            
            <Col className='mb-3'>
              <Form.Label><code>*</code> Déstination</Form.Label>
              <Form.Text className='mx-1'>(département / direction)</Form.Text>
              <ReactSelectField
                isAsync
                disabled={isLoading || isDepLoading}
                value={fields.destination}
                onChange={e => setFields({...fields, destination: e})}
                values={depOptions}
                onLoadOptions={onLoadDepartments}
                placeholder='-- --'/>
              {errors?.destination && <code><i className='bi bi-exclamation-circle-fill'/> {errors.destination}</code>}
            </Col>
          </Row>
          
          <Card.Title>DURÉE</Card.Title>
          <Form.Switch
            className='mb-2'
            disabled={isLoading}
            value={isChecked}
            onChange={toggleIsChecked}
            id='isChecked'
            label={<>{isChecked ? 'Indéterminée' : 'Déterminée'}</>}
            checked={isChecked}/>
          
          {!isChecked && (
            <Row>
              <Col className='mb-3'>
                <Form.Label htmlFor='startAt'>Début</Form.Label>
                <Form.Control
                  disabled={isLoading}
                  id='startAt'
                  type='date'
                  name='startAt'
                  value={fields.startAt}
                  onChange={e => onFieldChange(e, fields, setFields)}/>
              </Col>
              
              <Col className='mb-3'>
                <Form.Label htmlFor='endAt'>Fin</Form.Label>
                <Form.Control
                  disabled={isLoading}
                  id='endAt'
                  type='date'
                  name='endAt'
                  value={fields.endAt}
                  onChange={e => onFieldChange(e, fields, setFields)}/>
              </Col>
            </Row>
          )}
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

AddAssignmentModal.propTypes = {
  agent: PropTypes.any,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
}
