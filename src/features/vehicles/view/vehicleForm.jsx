import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert, ReactSelectField} from "../../../components";
import {useEffect, useMemo, useState} from "react";
import {vehicleErrors, vehicleFields} from "../model/vehicle.service";
import {useGetVehicleTypesListQuery, useLazyGetLoadVehicleTypesQuery} from "../model/vehicle.type.api.slice";
import toast from "react-hot-toast";
import {useEditVehicleMutation, usePostNewVehicleMutation} from "../model/vehicle.api.slice";
import {Button, Form, Spinner} from "react-bootstrap";
import {useSelector} from "react-redux";
import {onFieldChange} from "../../../services/form.handler.service";

export default function VehicleForm({data, onHide, onRefresh}) {
  const [fields, setFields] = useState(vehicleFields)
  const [errors, setErrors] = useState(vehicleErrors)
  const [getLoadVehicleTypes] = useLazyGetLoadVehicleTypesQuery()
  const [postNewVehicle, {isLoading, isError, error}] = usePostNewVehicleMutation()
  const [editVehicle, {isLoading: isEditLoad, isError: isEditError, error: editError}] = useEditVehicleMutation()
  const [validated, setValidated] = useState(false)
  
  const {nbPages} = useSelector(state => state.config)
  const {data: types=[], isLoading: isTypeLoad, isError: isTypeError, typeError} = useGetVehicleTypesListQuery(nbPages)
  
  let typeOptions
  typeOptions = useMemo(() => {
    let obj = []
    if (!isTypeError && types.length > 0) {
      obj = types.map(p => ({
        label: p?.name?.toUpperCase(),
        value: `/api/vehicle_types/${p.id}`,
      }))
    }
    
    return obj
  }, [isTypeError, types])
  
  const onReset = () => {
    setValidated(false)
    setErrors(vehicleErrors)
    setFields(vehicleFields)
  }
  
  async function onLoadTypes(keywords) {
    try {
      const search = await getLoadVehicleTypes(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setValidated(false)
    setErrors(vehicleErrors)
    
    const formData = new FormData()
    if (fields?.brand) formData.append('brand', fields.brand)
    if (fields?.chassis) formData.append('chassis', fields.chassis)
    if (fields?.color) formData.append('color', fields.color)
    if (fields?.numberplate) formData.append('numberplate', fields.numberplate)
    if (fields?.certificateFile) formData.append('certificateFile', fields.certificateFile)
    if (fields?.type) formData.append('type', fields.type?.value)
    
    try {
      const send = data ? await editVehicle(fields) : await postNewVehicle(formData)
      if (send?.data) {
        toast.success(data ? 'Modification bien efféctuée.' : 'Enregistrement bien efféctué.')
        if (!data) onReset()
        onHide()
        onRefresh()
      }
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  useEffect(() => {
    if (data) {
      const type = data?.type ? {label: data.type?.name?.toUpperCase(), value: data.type['@id']} : null
      setFields({
        type,
        color: data?.color ? data.color : '',
        chassis: data?.chassis ? data.chassis : '',
        brand: data.brand,
        numberplate: data?.numberplate ? data.numberplate : '',
        id: data.id,
      })
    }
  }, [data])
  
  useEffect(() => {
    if (isError) {
      const {violations} = error?.data
      if (violations) violations.forEach(({ propertyPath, message }) => {
        setErrors(s => ({...s, [propertyPath]: message}))
      })
    }
    
    if (isEditError) {
      const {violations} = editError?.data
      if (violations) violations.forEach(({ propertyPath, message }) => {
        setErrors(s => ({...s, [propertyPath]: message}))
      })
    }
  }, [isError, isEditError, error, editError]) // errors
  
  useEffect(() => {
    if (isTypeError) {
      if (typeError?.error) toast.error(typeError.error)
      if (typeError?.data && typeError.data['hydra:description']) toast.error(typeError.data['hydra:description'])
    }
  }, [isTypeError, typeError]) // types errors
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form noValidate validated={validated} onSubmit={onSubmit}>
        <FieldsAlert/>
        
        <div className='mb-3'>
          <Form.Label><code>*</code> Type de véhicule</Form.Label>
          <ReactSelectField
            isAsync
            required
            disabled={isTypeLoad || isLoading || isEditLoad}
            value={fields.type}
            onChange={e => setFields({...fields, type: e})}
            values={typeOptions}
            onLoadOptions={onLoadTypes}
            placeholder='-- --'/>
          {errors?.type && <code><i className='bi bi-exclamation-circle-fill'/> {errors.type}</code>}
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='brand'><code>*</code> Marque</Form.Label>
          <Form.Control
            required
            isInvalid={errors.brand !== null}
            disabled={isLoading || isEditLoad}
            id='brand'
            autoComplete='off'
            name='brand'
            value={fields.brand}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.brand}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='numberplate'><code>*</code> Immatriculation</Form.Label>
          <Form.Control
            required
            isInvalid={errors.numberplate !== null}
            disabled={isLoading || isEditLoad}
            id='numberplate'
            autoComplete='off'
            name='numberplate'
            value={fields.numberplate}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.numberplate}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='chassis'>Chassis</Form.Label>
          <Form.Control
            isInvalid={errors.chassis !== null}
            disabled={isLoading || isEditLoad}
            id='chassis'
            autoComplete='off'
            name='chassis'
            value={fields.chassis}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.chassis}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='color'>Couleur</Form.Label>
          <Form.Control
            isInvalid={errors.color !== null}
            disabled={isLoading || isEditLoad}
            id='color'
            autoComplete='off'
            name='color'
            value={fields.color}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.color}/>
        </div>
        
        {!data &&
          <div>
            <Form.Label htmlFor='certificateFile'>Certificat</Form.Label>
            <Form.Control
              isInvalid={errors.certificateFile !== null}
              disabled={isLoading || isEditLoad}
              type='file'
              id='certificateFile'
              autoComplete='off'
              name='certificateFile'
              onChange={e => onFieldChange(e, fields, setFields)}/>
            <FeedbackError error={errors.certificateFile}/>
          </div>} <hr/>
        
        <div className='text-end'>
          {!data &&
            <Button disabled={isLoading || isEditLoad} type='button' variant='light' className='me-1' onClick={onReset}>
              <i className='bi bi-x'/> Effacer
            </Button>}
          
          <Button disabled={isLoading || isEditLoad} type='submit'>
            {!(isLoading || isEditLoad) && <i className='bi bi-check me-1'/>}
            {(isLoading || isEditLoad) && <Spinner animation='grow' size='sm' className='me-1'/>}
            {!(isLoading || isEditLoad) ? 'Valider' : 'Veuillez patienter'}
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}
