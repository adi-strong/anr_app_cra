import {useEffect, useMemo, useState} from "react";
import toast from "react-hot-toast";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, ReactSelectField} from "../../../components";
import {Button, Form, Spinner} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import {useGetServicesListQuery, useLazyGetLoadServicesQuery} from "../../configurations/model/department.api.slice";
import {useEditJobMutation} from "../../jobs/model/job.api.service";

export default function EditJobForm({data, onRefresh, onHide}) {
  const [fields, setFields] = useState({name: '', service: null, description: ''})
  const [errors, setErrors] = useState({name: null, service: null, description: null})
  const [validate, setValidate] = useState(false)
  const [editFolderType, {isLoading, isError, error}] = useEditJobMutation()
  const [getLoadServices] = useLazyGetLoadServicesQuery()
  
  const {nbPages} = useSelector(state => state.config)
  const {data: services=[], isSLoading, isSError, sError} = useGetServicesListQuery(nbPages)
  
  useEffect(() => {
    if (isSError) {
      if (sError?.error) toast.error(sError.error)
      if (sError?.data && sError.data['hydra:description']) toast.error(sError.data['hydra:description'])
    }
  }, [isSError, sError])
  
  useEffect(() => {
    if (data) {
      const service = data?.service ? {
        label: data.service?.name?.toUpperCase(),
        value: data.service['@id']
      } : null
      
      setFields({
        name: data.name,
        id: data.id,
        description: data?.description ? data.description : '',
        service,
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
  }, [isError, error])
  
  let serviceOptions
  serviceOptions = useMemo(() => {
    let obj = []
    if (!isSError && services.length > 0) {
      obj = services.map(s => ({
        label: s?.name?.toUpperCase(),
        value: s['@id']
      }))
    }
    
    return obj
  }, [isSError, services])
  
  async function onLoadServices(keywords) {
    try {
      const search = await getLoadServices(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setErrors({name: null, service: null, description: null})
    setValidate(false)
    try {
      const send = await editFolderType(fields)
      if (send?.data) {
        toast.success('Modification bien efféctuée.')
        onHide()
      }
      // else setValidate(true)
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form noValidate validated={validate} onSubmit={onSubmit}>
        <div className='mb-3'>
          <Form.Label><code>*</code> Service</Form.Label>
          <ReactSelectField
            isAsync
            required
            disabled={isSLoading || isLoading}
            value={fields.service}
            values={serviceOptions}
            onChange={e => setFields({...fields, service: e})}
            onLoadOptions={onLoadServices}
            placeholder='-- --'/>
          {errors?.service && <code><i className='bi bi-exclamation-circle-fill'/> {errors.service}</code>}
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='name'><code>*</code> Fonction</Form.Label>
          <Form.Control
            disabled={isLoading}
            isInvalid={errors.name !== null}
            autoComplete='off'
            id='name'
            name='name'
            value={fields.name}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.name}/>
        </div>
        
        <div>
          <Form.Label htmlFor='description'>Job description</Form.Label>
          <Form.Control
            disabled={isLoading}
            isInvalid={errors.description !== null}
            rows={8}
            as='textarea'
            autoComplete='off'
            id='description'
            name='description'
            value={fields.description}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.description}/> <hr/>
        </div>
        
        <hr/>
        <Button disabled={isLoading} type='submit' className='d-block w-100'>
          {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
          {!isLoading && <i className='bi bi-pencil-square me-1'/>}
          {isLoading ? 'Veuillez patienter' : 'Modifier'}
        </Button>
      </Form>
    </ErrorBoundary>
  )
}

EditJobForm.propTypes = {
  data: PropTypes.any,
  onRefresh: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}
