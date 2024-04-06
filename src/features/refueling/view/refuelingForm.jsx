import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, ReactSelectField} from "../../../components";
import {Button, Card, Col, Form, InputGroup, Modal, Row, Spinner} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import {refuelingErrors, refuelingFields} from "../model/refueling.service";
import {useGetVehiclesListQuery, useLazyGetLoadVehiclesQuery} from "../../vehicles/model/vehicle.api.slice";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {useGetFuelSitesListQuery, useLazyGetLoadFuelSitesQuery} from "../../fuels/model/fuel.site.api.service";
import {onFieldChange} from "../../../services/form.handler.service";
import {usePostNewRefuelingMutation} from "../model/refueling.api.slice";

const ConfirmModal = ({show, onHide, onSubmit}) => {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton className='bg-warning'>
          <Modal.Title>
            <i className='bi bi-exclamation-triangle-fill'/> Confirmation
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className='text-center'>
          <code className='text-primary'>
            <small>
              <i className='bi bi-exclamation-circle-fill'/> Cette action est irréversible.
            </small>
          </code> <br/> <br/>
          
          <span>Veuillez confirmer cette opération <i className='bi bi-exclamation-triangle-fill'/></span>
        </Modal.Body>
        
        <Modal.Footer>
          <Button type='button' variant='light' onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          
          <Button autoFocus type='submit' variant='warning' onClick={e => onSubmit(e)}>
            <i className='bi bi-check'/> Confirmer
          </Button>
        </Modal.Footer>
      </Modal>
    </ErrorBoundary>
  )
}

export default function RefuelingForm() {
  const [fields, setFields] = useState(refuelingFields)
  const [errors, setErrors] = useState(refuelingErrors)
  const [getLoadVehicles] = useLazyGetLoadVehiclesQuery()
  const [getLoadFuelSites] = useLazyGetLoadFuelSitesQuery()
  const [fuelOptions, setFuelOptions] = useState([])
  const [postNewRefueling, {isLoading, isError, error}] = usePostNewRefuelingMutation()
  const [show, setShow] = useState(false)
  
  const {nbPages} = useSelector(state => state.config)
  const {data: vehicles=[], isLoading: isVLoading, isError: isVError, error: vError} = useGetVehiclesListQuery(nbPages)
  const {data: sites=[], isLoading: isFLoading, isError: isFError, error: fError} = useGetFuelSitesListQuery(nbPages)
  
  let vehicleOptions, siteOptions
  
  vehicleOptions = useMemo(() => {
    let obj = []
    if (!isVError && vehicles.length > 0) {
      obj = vehicles.map(p => {
        const name = p?.agent ? p.agent.name.toUpperCase() : ''
        const lastName = p?.agent && p.agent?.lastName ? p.agent.lastName.toUpperCase() : ''
        const firstName = p?.agent && p.agent?.firstName ? p.agent.firstName.toUpperCase() : ''
        
        const agent = p?.agent ? {
          label: name+' '+lastName+' '+firstName,
          value: p.agent['@id'],
        } : null
        
        return {
          label: p?.brand?.toUpperCase(),
          value: `/api/vehicles/${p.id}`,
          agent,
        }
      })
    }
    
    return obj
  }, [isVError, vehicles])
  
  siteOptions = useMemo(() => {
    let obj = []
    if (!isFError && sites.length > 0) {
      obj = sites.map(p => ({
        label: p?.name?.toUpperCase(),
        value: p['@id'],
        siteId: p?.id,
        fuels: p?.fuels && p.fuels?.length > 0 ? p.fuels : [],
      }))
    }
    
    return obj
  }, [isFError, sites])
  
  const toggleShow = () => setShow(!show)
  
  const onReset = () => {
    setErrors(refuelingErrors)
    setFields(refuelingFields)
  }
  
  async function onLoadVehicles(keywords) {
    try {
      const search = await getLoadVehicles(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  async function onLoadFuelSites(keywords) {
    try {
      const search = await getLoadFuelSites(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onVehicleChange = (e) => {
    const vehicle = e
    const agent = vehicle ? vehicle?.agent : null
    
    setFields({...fields, agent, vehicle})
  }
  
  const onSiteChange = (e) => {
    const site = e
    let options = []
    const obj = site && site?.fuels && site.fuels?.length > 0 ? site.fuels : []
    
    if (obj.length > 0) {
      for (const key in obj) {
        const option = obj[key]
        if (!option.isDeleted) {
          options.push({
            label: option?.name?.toUpperCase(),
            value: option?.name?.toUpperCase(),
            data: option['@id'],
          })
        }
      }
    }
    
    setFuelOptions(options)
    setFields({...fields, site, fuel: null, quantity: 0})
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setErrors(refuelingErrors)
    toggleShow()
    
    try {
      const send = await postNewRefueling(fields)
      if (send?.data) {
        toast.success('Ravitaillement bien efféctué.')
        onReset()
      }
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  useEffect(() => {
    if (isVError) {
      if (vError?.error) toast.error(vError.error)
      if (vError?.data && vError.data['hydra:description']) toast.error(vError.data['hydra:description'])
    }
    
    if (isFError) {
      if (fError?.error) toast.error(fError.error)
      if (fError?.data && fError.data['hydra:description']) toast.error(fError.data['hydra:description'])
    }
  }, [isVError, isFError, fError, vError])
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
      
      const {violations} = error?.data
      if (violations) violations.forEach(({ propertyPath, message }) => {
        setErrors(s => ({...s, [propertyPath]: message}))
      })
    }
  }, [isError, error])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form onSubmit={onSubmit}>
        <Row>
          <Col md={5} className='mb-3'>
            <div className='mb-3'>
              <Form.Label><code>*</code> Véhicule</Form.Label>
              <ReactSelectField
                isAsync
                required
                disabled={isVLoading || isLoading}
                value={fields.vehicle}
                values={vehicleOptions}
                onLoadOptions={onLoadVehicles}
                onChange={e => onVehicleChange(e)}
                placeholder='-- --'/>
              {errors?.vehicle && <code><i className='bi bi-exclamation-circle-fill'/> {errors.vehicle}</code>}
            </div>
            
            <div className='mb-3'>
              <Card.Title className='mb-1 fw-bold'><code>*</code> Agent :</Card.Title>
              {fields?.agent &&
                <span className='fw-bold text-dark'>
                  <i className='bi bi-person-fill me-1'/>
                  {fields.agent?.label}
                </span>} <br/>
              {errors?.agent && <code><i className='bi bi-exclamation-circle-fill'/> {errors.agent}</code>}
            </div>
          </Col>
          
          <Col md={7} className='mb-3'>
            <div className='mb-3'>
              <Form.Label><code>*</code> Site</Form.Label>
              <ReactSelectField
                isAsync
                required
                disabled={isFLoading || isLoading}
                value={fields.site}
                values={siteOptions}
                onLoadOptions={onLoadFuelSites}
                onChange={e => onSiteChange(e)}
                placeholder='-- --'/>
              {errors?.site && <code><i className='bi bi-exclamation-circle-fill'/> {errors.site}</code>}
            </div>
            
            <div className='mb-3'>
              <Form.Label><code>*</code> Stock / Carburant</Form.Label>
              <ReactSelectField
                required
                disabled={isFLoading || isLoading ||!fields.site}
                value={fields.fuel}
                values={fuelOptions}
                onChange={e => setFields({...fields, fuel: e})}
                placeholder='-- --'/>
              {errors?.fuel && <code><i className='bi bi-exclamation-circle-fill'/> {errors.fuel}</code>}
            </div>
            
            <div className='mb-3'>
              <Form.Label htmlFor='quantity'><code>*</code> Quantité</Form.Label>
              <InputGroup>
                <Form.Control
                  required
                  disabled={isLoading}
                  isInvalid={errors.quantity !== null}
                  type='number'
                  id='quantity'
                  name='quantity'
                  value={fields.quantity}
                  onChange={e => onFieldChange(e, fields, setFields)}/>
                <InputGroup.Text>Litre(s)</InputGroup.Text>
              </InputGroup>
              <FeedbackError error={errors.quantity}/>
            </div>
            
            <Button disabled={isLoading} type='button' variant='light' onClick={onReset} className='d-block w-100 mb-2'>
              <i className='bi bi-trash'/> Effacer
            </Button>
            
            <Button disabled={isLoading} type='button' onClick={toggleShow} className='d-block w-100 mb-2'>
              {!isLoading && <i className='bi bi-check me-1'/>}
              {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
              {isLoading ? 'Veuillez patienter' : 'Valider'}
            </Button>
          </Col>
        </Row>
        
        <ConfirmModal show={show} onHide={toggleShow} onSubmit={onSubmit}/>
      </Form>
    </ErrorBoundary>
  )
}
