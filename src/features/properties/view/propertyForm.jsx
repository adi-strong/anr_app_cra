import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert, ReactSelectField} from "../../../components";
import {useEffect, useMemo, useState} from "react";
import {propertyErrors, propertyFields} from "../model/property.service";
import {useEditPropertyMutation, usePostNewPropertyMutation} from "../model/property.api.slice";
import {useGetPropertyTypesListQuery, useLazyGetLoadPropertyTypesQuery} from "../model/property.type.api.slice";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {useGetProvincesListQuery, useLazyGetLoadProvincesQuery} from "../../configurations/model/province.api.slice";
import {useNavigate} from "react-router-dom";
import {Button, Card, Col, Form, Row, Spinner} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";

export default function PropertyForm({data, loader = false}) {
  const [fields, setFields] = useState(propertyFields)
  const [errors, setErrors] = useState(propertyErrors)
  const [postNewProperty, {isLoading, isError, error}] = usePostNewPropertyMutation()
  const [editProperty, {isLoading: isEditLoading, isError: isEditErr, error: editErr}] = useEditPropertyMutation()
  const [getLoadPropertyTypes] = useLazyGetLoadPropertyTypesQuery()
  const [getLoadProvinces] = useLazyGetLoadProvincesQuery()
  const [validated, setValidated] = useState(false)
  
  const {nbPages} = useSelector(state => state.config)
  const {data: types=[], isError: isTypeError, isLoading: isTypeLoad, error: typeError}
    = useGetPropertyTypesListQuery(nbPages)
  const {data: provinces=[], isError: isPrError, isLoading: isPrLoad, error: prError}
    = useGetProvincesListQuery(nbPages)
  
  let typeOptions, provOptions
  
  typeOptions = useMemo(() => {
    let obj = []
    if (!isTypeError && types.length > 0) {
      obj = types.map(p => ({
        label: p?.name?.toUpperCase(),
        value: p['@id']
      }))
    }
    
    return obj
  }, [isTypeError, types])
  
  provOptions = useMemo(() => {
    let obj = []
    if (!isPrError && provinces.length > 0) {
      obj = provinces.map(p => ({
        label: p?.name?.toUpperCase(),
        value: p['@id']
      }))
    }
    
    return obj
  }, [isPrError, provinces])
  
  async function onLoadTypes(keywords) {
    try {
      const search = await getLoadPropertyTypes(keywords)
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
  
  const onReset = () => {
    setValidated(false)
    setErrors(propertyErrors)
    setFields(propertyFields)
  }
  
  const navigate = useNavigate()
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setValidated(false)
    setErrors(propertyErrors)
    
    const formData = new FormData()
    if (fields?.postalCode) formData.append('postalCode', fields.postalCode)
    if (fields?.avenue) formData.append('avenue', fields.avenue)
    if (fields?.number) formData.append('number', fields.number)
    if (fields?.quarter) formData.append('quarter', fields.quarter)
    if (fields?.commune) formData.append('commune', fields.commune)
    if (fields?.surface) formData.append('surface', fields.surface)
    if (fields?.pieces) formData.append('pieces', fields.pieces)
    if (fields?.price) formData.append('price', fields.price)
    if (fields?.description) formData.append('description', fields.description)
    if (fields?.type) formData.append('type', fields.type?.value)
    if (fields?.province) formData.append('province', fields.province?.value)
    if (fields?.longitude) formData.append('longitude', fields.longitude)
    if (fields?.latitude) formData.append('latitude', fields.latitude)
    
    try {
      const send = data ? await editProperty(fields) : await postNewProperty(formData)
      if (send?.data) {
        toast.success(data ? 'Modification bien efféctuée.' : 'Enregistrement bien efféctué.')
        if (!data) onReset()
        navigate('/app/properties')
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
        value: data.province['@id'],
      } : null
      
      const type = data?.type ? {
        label: data.type.name.toUpperCase(),
        value: data.type['@id'],
      } : null
      
      setFields({
        avenue: data?.avenue ? data.avenue : '',
        commune: data?.commune ? data.commune : '',
        description: data?.description ? data.description : '',
        latitude: data?.latitude ? data.latitude : '',
        longitude: data?.longitude ? data.longitude : '',
        number: data?.number ? data.number : '',
        pieces: data?.pieces ? data.pieces : '',
        postalCode: data?.postalCode ? data.postalCode : '',
        price: data?.price ? data.price : '',
        quarter: data?.quarter ? data.quarter : '',
        surface: data?.surface ? data.surface : '',
        province,
        type,
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
    
    if (isEditErr) {
      const {violations} = editErr?.data
      if (violations) violations.forEach(({ propertyPath, message }) => {
        setErrors(s => ({...s, [propertyPath]: message}))
      })
    }
  }, [isError, error, isEditErr, editErr])
  
  useEffect(() => {
    if (isTypeError) {
      if (typeError?.error) toast.error(typeError.error)
      if (typeError?.data && typeError.data['hydra:description']) toast.error(typeError.data['hydra:description'])
    }
    
    if (isPrError) {
      if (prError?.error) toast.error(prError.error)
      if (prError?.data && prError.data['hydra:description']) toast.error(prError.data['hydra:description'])
    }
  }, [isTypeError, isPrError, typeError, prError])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <FieldsAlert/>
      <h4>Formulaire d'enregistrement</h4>
      
      <Form noValidate validated={validated} onSubmit={onSubmit}>
        <Row>
          <Col md={7} className='mb-3'>
            <Card>
              <Card.Body>
                <Card.Title><i className='bi bi-map'/> Adresse</Card.Title>
                
                <Row>
                  <Col md={6} className='mb-3'>
                    <Form.Label htmlFor='commune'>Commune / Secteur</Form.Label>
                    <Form.Control
                      isInvalid={errors.commune !== null}
                      disabled={isLoading || isEditLoading || loader}
                      autoComplete='off'
                      id='commune'
                      name='commune'
                      value={fields.commune}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.commune}/>
                  </Col>
                  
                  <Col md={6} className='mb-3'>
                    <Form.Label htmlFor='quarter'>Quartier</Form.Label>
                    <Form.Control
                      isInvalid={errors.quarter !== null}
                      disabled={isLoading || isEditLoading || loader}
                      autoComplete='off'
                      id='quarter'
                      name='quarter'
                      value={fields.quarter}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.quarter}/>
                  </Col>
                  
                  <Col md={6} className='mb-3'>
                    <Form.Label htmlFor='avenue'><code>*</code> Avenue</Form.Label>
                    <Form.Control
                      required
                      isInvalid={errors.avenue !== null}
                      disabled={isLoading || isEditLoading || loader}
                      autoComplete='off'
                      id='avenue'
                      name='avenue'
                      value={fields.avenue}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.avenue}/>
                  </Col>
                  
                  <Col md={6} className='mb-3'>
                    <Form.Label htmlFor='number'><code>*</code> Numéro</Form.Label>
                    <Form.Control
                      required
                      isInvalid={errors.number !== null}
                      disabled={isLoading || isEditLoading || loader}
                      autoComplete='off'
                      id='number'
                      name='number'
                      value={fields.number}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.number}/>
                  </Col>
                </Row>
                
                <Card.Title className='mt-4'><i className='bi bi-info'/> Autres informations</Card.Title>
                
                
                <div className='mb-3'>
                  <Form.Label htmlFor='postalCode'><code>*</code> Code postal</Form.Label>
                  <Form.Control
                    required
                    isInvalid={errors.postalCode !== null}
                    disabled={isLoading || isEditLoading || loader}
                    autoComplete='off'
                    id='postalCode'
                    placeholder='Exemple : 00243'
                    name='postalCode'
                    value={fields.postalCode}
                    onChange={e => onFieldChange(e, fields, setFields)}/>
                  <FeedbackError error={errors.postalCode}/>
                </div>
                
                <Row>
                  <Col md={6} className='mb-3'>
                    <Form.Label htmlFor='surface'><code>*</code> Surface</Form.Label>
                    <Form.Control
                      required
                      isInvalid={errors.surface !== null}
                      disabled={isLoading || isEditLoading || loader}
                      autoComplete='off'
                      id='surface'
                      name='surface'
                      value={fields.surface}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.surface}/>
                  </Col>
                  
                  <Col md={6} className='mb-3'>
                    <Form.Label htmlFor='pieces'>Pièce(s)</Form.Label>
                    <Form.Control
                      isInvalid={errors.pieces !== null}
                      disabled={isLoading || isEditLoading || loader}
                      autoComplete='off'
                      id='pieces'
                      name='pieces'
                      value={fields.pieces}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.pieces}/>
                  </Col
                  >
                </Row>
                
                <div className='mb-3'>
                  <Form.Label><code>*</code> Province</Form.Label>
                  <ReactSelectField
                    isAsync
                    required
                    disabled={isLoading || isEditLoading || isPrLoad || loader}
                    value={fields.province}
                    values={provOptions}
                    onChange={e => setFields({...fields, province: e})}
                    onLoadOptions={onLoadProvinces}
                    placeholder='-- --'/>
                  {errors?.province && <code><i className='bi bi-exclamation-circle-fill'/> {errors.province}</code>}
                </div>
                
                <div className='mb-3'>
                  <Form.Label>Type de propriété</Form.Label>
                  <ReactSelectField
                    isAsync
                    disabled={isLoading || isEditLoading || isTypeLoad || loader}
                    value={fields.type}
                    values={typeOptions}
                    onChange={e => setFields({...fields, type: e})}
                    onLoadOptions={onLoadTypes}
                    placeholder='-- --'/>
                  {errors?.type && <code><i className='bi bi-exclamation-circle-fill'/> {errors.type}</code>}
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={5} className='mb-3'>
            <Card>
              <Card.Body>
                <Card.Title><i className='bi bi-geo-alt'/> Emplacement</Card.Title>
                
                <div className='mb-3'>
                  <Form.Label htmlFor='longitude'>Longitude</Form.Label>
                  <Form.Control
                    isInvalid={errors.longitude !== null}
                    disabled={isLoading || isEditLoading || loader}
                    autoComplete='off'
                    id='longitude'
                    name='longitude'
                    value={fields.longitude}
                    onChange={e => onFieldChange(e, fields, setFields)}/>
                  <FeedbackError error={errors.longitude}/>
                </div>
                
                <div className='mb-3'>
                  <Form.Label htmlFor='latitude'>Latitude</Form.Label>
                  <Form.Control
                    isInvalid={errors.latitude !== null}
                    disabled={isLoading || isEditLoading || loader}
                    autoComplete='off'
                    id='latitude'
                    name='latitude'
                    value={fields.latitude}
                    onChange={e => onFieldChange(e, fields, setFields)}/>
                  <FeedbackError error={errors.latitude}/>
                </div>
              </Card.Body>
            </Card>
            
            <Card className='mt-3'>
              <Card.Body>
                <div className='mb-3'>
                  <Form.Label htmlFor='description'>Description</Form.Label>
                  <Form.Control
                    isInvalid={errors.description !== null}
                    disabled={isLoading || isEditLoading || loader}
                    autoComplete='off'
                    as='textarea'
                    id='description'
                    rows={8}
                    name='description'
                    value={fields.description}
                    onChange={e => onFieldChange(e, fields, setFields)}/>
                  <FeedbackError error={errors.description}/>
                </div>
                
                {!data &&
                  <Button
                    disabled={isLoading || isEditLoading || loader}
                    type='button'
                    onClick={onReset}
                    variant='light'
                    className='d-block w-100 mb-2'>
                    <i className='bi bi-trash'/> Effacer
                  </Button>}
                
                <Button
                  disabled={isLoading || isEditLoading || loader}
                  type='submit'
                  className='d-block w-100'>
                  <i className='bi bi-check me-1'/>
                  {(isLoading || isEditLoading) && <Spinner animation='grow' size='sm' className='me-1'/>}
                  {!(isLoading || isEditLoading) ? 'Valider' : 'Veuillez patienter'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </ErrorBoundary>
  )
}
