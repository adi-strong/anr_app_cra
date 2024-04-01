import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert} from "../../../components";
import {useEffect, useState} from "react";
import {fuelSiteErrors, fuelSiteFields} from "../model/fuel.service";
import {useEditFuelSiteMutation, usePostNewFuelSiteMutation} from "../model/fuel.site.api.service";
import toast from "react-hot-toast";
import {Button, Form, Spinner} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";

export default function AddFuelStockForm({onHide, onRefresh, data}) {
  const [fields, setFields] = useState(fuelSiteFields)
  const [errors, setErrors] = useState(fuelSiteErrors)
  const [postNewFuelSite, {isLoading, isError, error}] = usePostNewFuelSiteMutation()
  const [editFuelSite, {isLoading: isEditLoad, isError: isEditError, error: editError}] = useEditFuelSiteMutation()
  const [isValidated, setIsValidated] = useState(false)
  
  const onReset = () => {
    setIsValidated(false)
    setErrors(fuelSiteErrors)
    setFields(fuelSiteFields)
  }
  
  const onSubmit = async e => {
    e.preventDefault()
    setIsValidated(false)
    setErrors(fuelSiteErrors)
    
    try {
      const send = data ? await editFuelSite(fields) : await postNewFuelSite(fields)
      if (send?.data) {
        toast.success(data ? 'Modification bien effctuée.' : 'Enregistrement bien efféctué.')
        if (!data) onReset()
        onHide()
        onRefresh()
      }
      else setIsValidated(true)
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  useEffect(() => {
    if (data) {
      setFields({
        name: data.name,
        address: data?.address ? data.address : '',
        id: data.id
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
  }, [isError, isEditError, error, editError])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form noValidate validated={isValidated} onSubmit={onSubmit}>
        <FieldsAlert/>
        
        <div className='mb-3'>
          <Form.Label htmlFor='name'><code>*</code> Désignation</Form.Label>
          <Form.Control
            required
            autoFocus
            autoComplete='off'
            isInvalid={errors.name !== null}
            disabled={isLoading || isEditLoad}
            id='name'
            name='name'
            value={fields.name}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.name}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='address'><code>*</code> Adresse</Form.Label>
          <Form.Control
            required
            autoComplete='off'
            as='textarea'
            isInvalid={errors.address !== null}
            disabled={isLoading || isEditLoad}
            id='address'
            name='address'
            value={fields.address}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.address}/>
        </div>
        
        <hr/>
        <div className='text-end'>
          <Button type='button' disabled={isLoading || isEditLoad} variant='light' onClick={onReset} className='me-2'>
            <i className='bi bi-trash'/> Effacer
          </Button>
          
          <Button type='submit' disabled={isLoading || isEditLoad}>
            {(isLoading || isEditLoad) && <Spinner animation='grow' size='sm' className='me-1'/>}
            {!(isLoading || isEditLoad) ? 'Enregistrer' : 'Veuillez patienter'}
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}
