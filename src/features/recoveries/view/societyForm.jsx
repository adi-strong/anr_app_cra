import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert, ReactSelectField} from "../../../components";
import {useEffect, useMemo, useState} from "react";
import {societyErrors, societyFields} from "../model/society.service";
import {useEditSocietyMutation, usePostNewSocietyMutation} from "../model/society.api.slice";
import toast from "react-hot-toast";
import {Button, Form, Spinner} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import {useGetSocietyTypesListQuery, useLazyGetLoadSocietyTypesQuery} from "../model/society.type.api.service";
import {useGetProvincesListQuery, useLazyGetLoadProvincesQuery} from "../../configurations/model/province.api.slice";
import {useSelector} from "react-redux";

export default function SocietyForm({data, onHide, onRefresh}) {
  const [fields, setFields] = useState(societyFields)
  const [errors, setErrors] = useState(societyErrors)
  const [postNewSociety, {isLoading, isError, error}] = usePostNewSocietyMutation()
  const [editSociety, {isLoading: isEditLoading, isError: isEditError, error: editError}] = useEditSocietyMutation()
  const [validated, setValidated] = useState(false)
  const [getLoadSocietyTypes] = useLazyGetLoadSocietyTypesQuery()
  const [getLoadProvinces] = useLazyGetLoadProvincesQuery()
  
  const {nbPages} = useSelector(state => state.config)
  
  const {data: types=[], isError: isTError, error: tError, isLoading: isTLoading}
    = useGetSocietyTypesListQuery(nbPages)
  
  const {data: provinces=[], isError: isPError, error: pError, isLoading: isPLoading}
    = useGetProvincesListQuery(nbPages)
  
  let typeOptions, provOptions
  
  typeOptions = useMemo(() => {
    let obj = []
    if (!isTError && types.length > 0) {
      obj = types.map(p => ({
        label: p.name.toUpperCase(),
        value: p['@id']
      }))
    }
    
    return obj
  }, [isTError, types])
  
  provOptions = useMemo(() => {
    let obj = []
    if (!isPError && provinces.length > 0) {
      obj = provinces.map(p => ({
        label: p.name.toUpperCase(),
        value: p['@id']
      }))
    }
    
    return obj
  }, [isPError, provinces])
  
  const onReset = () => {
    setValidated(false)
    setErrors(societyErrors)
    setFields(societyFields)
  }
  
  async function onLoadProvinces(keywords) {
    try {
      const search = await getLoadProvinces(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  async function onLoadSocietyTypes(keywords) {
    try {
      const search = await getLoadSocietyTypes(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setValidated(false)
    setErrors(societyErrors)
    
    const formData = new FormData()
    if (fields?.name) formData.append('name', fields.name)
    if (fields?.tradeName) formData.append('tradeName', fields.tradeName)
    if (fields?.province) formData.append('province', fields.province?.value)
    if (fields?.type) formData.append('type', fields.type?.value)
    if (fields?.rccmFile) formData.append('rccmFile', fields.rccmFile)
    if (fields?.address) formData.append('address', fields.address)
    if (fields?.phone) formData.append('phone', fields.phone)
    if (fields?.focal) formData.append('focal', fields.focal)
    
    try {
      const send = data ? await editSociety(fields) : await postNewSociety(formData)
      if (send?.data) {
        toast.success(data ? 'Modification bien efféctuée.' : 'Enregistrement bien efféctué.')
        onReset()
        onHide()
        onRefresh()
      }
      else setValidated(true)
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  useEffect(() => {
    if (data) {
      const province = data?.province ? {
        label: data.province.name.toUpperCase(),
        value: data.province['@id']
      } : null
      
      const type = data?.type ? {
        label: data.type.name.toUpperCase(),
        value: data.type['@id']
      } : null
      
      setFields({
        name: data.name,
        tradeName: data?.tradeName ? data.tradeName : '',
        address: data?.address ? data.address : '',
        province,
        type,
        id: data.id,
        focal: data?.focal ? data.focal : '',
        phone: data?.phone ? data.phone : '',
      })
    }
  }, [data]) // get data
  
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
  }, [isError, isEditError, error, editError]) // fields errors
  
  useEffect(() => {
    if (isTError) {
      if (tError?.error) toast.error(tError.error)
      if (tError?.data && tError.data['hydra:description']) toast.error(tError.data['hydra:description'])
    }
    
    if (isPError) {
      if (pError?.error) toast.error(pError.error)
      if (pError?.data && pError.data['hydra:description']) toast.error(pError.data['hydra:description'])
    }
  }, [isTError, isPError, tError, pError]) // errors
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <FieldsAlert/>
      
      <Form noValidate validated={validated} onSubmit={onSubmit}>
        <div className='mb-3'>
          <Form.Label><code>*</code> Type d'activité</Form.Label>
          <ReactSelectField
            isAsync
            required
            disabled={isLoading || isEditLoading || isTLoading}
            value={fields.type}
            onChange={e => setFields({...fields, type: e})}
            values={typeOptions}
            onLoadOptions={onLoadSocietyTypes}
            placeholder='-- --'/>
          {errors?.type && <code><i className='bi bi-exclamation-circle-fill'/> {errors.type}</code>}
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='name'><code>*</code> Désignation</Form.Label>
          <Form.Control
            required
            isInvalid={errors.name !== null}
            disabled={isLoading || isEditLoading}
            autoComplete='off'
            id='name'
            name='name'
            value={fields.name}
            placeholder="Nom de la société"
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.name}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='tradeName'>Nom commercial</Form.Label>
          <Form.Control
            isInvalid={errors.tradeName !== null}
            disabled={isLoading || isEditLoading}
            autoComplete='off'
            id='tradeName'
            name='tradeName'
            value={fields.tradeName}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.tradeName}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='focal'>Point focal</Form.Label>
          <Form.Control
            isInvalid={errors.focal !== null}
            disabled={isLoading || isEditLoading}
            autoComplete='off'
            id='focal'
            name='focal'
            value={fields.focal}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.focal}/>
        </div>
        
        <div className='mb-3'>
          <Form.Label htmlFor='phone'><code>*</code> N° Tél.</Form.Label>
          <Form.Control
            required
            isInvalid={errors.phone !== null}
            disabled={isLoading || isEditLoading}
            autoComplete='off'
            id='phone'
            name='phone'
            value={fields.phone}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.phone}/>
        </div>
        
        {!data &&
          <div className='mb-3'>
            <Form.Label htmlFor='rccmFile'><code>*</code> RCCM</Form.Label>
            <Form.Text className='mx-1'>(fichier à insérer)</Form.Text>
            <Form.Control
              isInvalid={errors.rccmFile !== null}
              disabled={isLoading || isEditLoading}
              accept='.pdf, .docx, .doc, .xls, .xlsx'
              type='file'
              id='rccmFile'
              name='rccmFile'
              onChange={e => onFieldChange(e, fields, setFields)}/>
            <FeedbackError error={errors.rccmFile}/>
          </div>}
        
        <div className='mb-3'>
          <Form.Label><code>*</code> Province</Form.Label>
          <ReactSelectField
            isAsync
            required
            disabled={isLoading || isEditLoading || isPLoading}
            value={fields.province}
            onChange={e => setFields({...fields, province: e})}
            values={provOptions}
            onLoadOptions={onLoadProvinces}
            placeholder='-- --'/>
          {errors?.type && <code><i className='bi bi-exclamation-circle-fill'/> {errors.type}</code>}
        </div>
        
        <div>
          <Form.Label htmlFor='address'><code>*</code> Adresse</Form.Label>
          <Form.Control
            required
            isInvalid={errors.address !== null}
            disabled={isLoading || isEditLoading}
            autoComplete='off'
            as='textarea'
            id='address'
            name='address'
            value={fields.address}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.address}/>
        </div>
        
        <hr/>
        <div className='text-end'>
          {!data &&
            <Button
              disabled={isLoading || isEditLoading}
              type='button'
              variant='light'
              onClick={onReset}
              className='me-1'>
              <i className='bi bi-trash'/> Effacer
            </Button>}
          
          <Button disabled={isLoading || isEditLoading} type='submit'>
            {(isLoading || isEditLoading) && <Spinner animation='grow' size='sm' className='me-1'/>}
            {!(isLoading || isEditLoading) && <i className='bi bi-check me-1'/>}
            {!(isLoading || isEditLoading) ? 'Valider' : 'Veuillez patienter'}
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}
