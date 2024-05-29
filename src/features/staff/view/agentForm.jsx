import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert, ReactSelectField, UpdateImageFields} from "../../../components";
import PropTypes from "prop-types";
import {Button, Card, Col, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import {onFieldChange} from "../../../services/form.handler.service";
import {maritalStatusOptions, onArrayChange, sexOptions} from "../../../services";
import AddPatientImageField from "../../patients/view/addPatientImageField";
import {agentErrors, agentFields, bloodOptions} from "../model/agent.service";
import toast from "react-hot-toast";
import {
  useDeleteAgentProfileMutation,
  useEditAgentMutation,
  usePostNewAgentMutation,
  useUpdateAgentProfileMutation
} from "../model/agent.api.slice";
import {useGetProvincesListQuery, useLazyGetLoadProvincesQuery} from "../../configurations/model/province.api.slice";
import {
  useGetDepartmentsListQuery,
  useLazyGetLoadDepartmentsQuery
} from "../../configurations/model/department.api.slice";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {entrypoint} from "../../../app/store";

export default function AgentForm({data, onRefresh, loader = false}) {
  const [validated, setValidated] = useState(false)
  const [fields, setFields] = useState(agentFields)
  const [errors, setErrors] = useState(agentErrors)
  const [postNewAgent, {isLoading, isError, error}] = usePostNewAgentMutation()
  const [editAgent, {isLoading: isEditLoading, isError: isEditError, error: editError}] = useEditAgentMutation()
  const [getLoadProvinces] = useLazyGetLoadProvincesQuery()
  const [getLoadDepartments] = useLazyGetLoadDepartmentsQuery()
  const [image, setImage] = useState([])
  const [updateAgentProfile, {isLoading: isUpdLoading, isError: isUpError, error: upError}]
    = useUpdateAgentProfileMutation()
  const [deleteAgentProfile, {isLoading: isDeLoading, isError: isDelError, error: delError}]
    = useDeleteAgentProfileMutation()
  
  const {nbPages} = useSelector(state => state.config)
  const {data: provinces=[], isLoading:isProvLoading, isError:isProvError} = useGetProvincesListQuery(nbPages)
  const {data: departments=[], isLoading:isDepLoading, isError:isDepError} = useGetDepartmentsListQuery(nbPages)
  
  const navigate = useNavigate()
  let provOptions, depOptions, gradeOptions, serviceOptions, jobOptions
  
  provOptions = useMemo(() => {
    let obj = []
    if (!isProvError && provinces.length > 0) obj = provinces.map(p => ({
      label: p?.name?.toUpperCase(),
      value: p['@id']
    }))
    
    return obj
  }, [provinces, isProvError])
  
  depOptions = useMemo(() => {
    let obj = []
    if (!isDepError && departments.length > 0) obj = departments.map(p => ({
      label: p?.name?.toUpperCase(),
      value: p['@id'],
      grades: p?.grades && p.grades.length > 0 ? p.grades : [],
      departmentServices: p?.departmentServices && p.departmentServices.length > 0 ? p.departmentServices : [],
    }))
    
    return obj
  }, [departments, isDepError])
  
  gradeOptions = useMemo(() => {
    return fields.department && fields.department?.grades && fields.department.grades?.length > 0
      ? fields.department.grades?.map(g => ({
        label: g?.name?.toUpperCase(),
        value: g?.name?.toUpperCase(),
        data: g['@id'],
      }))
      : []
  }, [fields])
  
  serviceOptions = useMemo(() => {
    return fields.department && fields.department?.departmentServices
    && fields.department.departmentServices?.length > 0
      ? fields.department.departmentServices?.map(g => ({
        label: g?.name?.toUpperCase(),
        value: g?.name?.toUpperCase(),
        data: g['@id'],
        jobs: g?.jobs && g.jobs?.length > 0 ? g.jobs : [],
      }))
      : []
  }, [fields])
  
  jobOptions = useMemo(() => {
    const obj = []
    for (const key in serviceOptions) {
      const jobs = serviceOptions[key]?.jobs
      if (jobs && jobs?.length > 0) {
        for (const j in jobs) {
          const job = jobs[j]
          obj.push({label: job.name.toUpperCase(), value: job.name.toUpperCase(), data: job['@id']})
        }
      }
    }
    
    return obj
  }, [serviceOptions])
  
  const onImageChange = (imageList, addUpdateIndex) => {
    setFields({...fields, file: imageList})
  }
  
  
  const onUpdateImageChange = async (imageList, addUpdateIndex) => {
    if (data) {
      setImage(imageList)
      try {
        const formData = new FormData()
        formData.append('agentId', data.id)
        formData.append('file', imageList[0]?.file)
        
        const send = await updateAgentProfile({id: data.id, formData})
        if (send?.data) {
          toast.success('Profil mis à jour.')
        }
      }
      catch (e) { toast.error('Problème de connexion.' )}
    }
  }
  
  const onRemoveImageChange = async () => {
    if (data) {
      try {
        const send = await deleteAgentProfile(data)
        if (send?.data) {
          toast.success('Profil mis à jour.')
          setImage([])
        }
      }
      catch (e) { toast.error('Problème de connexion.' )}
    }
  }
  
  const onReset = () => {
    setErrors(agentErrors)
    setFields(agentFields)
  }
  
  const onAddAgentItem = () => {
    setFields({...fields, children: [...fields.children, {name: '', bornAt: '', bornPlace: ''}]
    })
  }
  
  const onRemoveAgentItem = (index) => {
    const children = [...fields.children]
    children.splice(index, 1)
    setFields({...fields, children})
  }
  
  async function onLoadProvinces(keywords) {
    try {
      const search = await getLoadProvinces(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  async function onLoadDepartments(keywords) {
    try {
      const search = await getLoadDepartments(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onDepartmentChange = (e) => {
    const department = e
    const grade = null
    const service = null
    const job = null
    
    setFields({...fields, department, grade, service, job})
  }
  
  const onServiceChange = (e) => {
    const service = e
    const job = null
    setFields({...fields, service, job})
  }
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setErrors(agentErrors)
    setValidated(false)
    
    const formData = new FormData()
    formData.append('name', fields.name)
    formData.append('register', fields.register)
    formData.append('pseudo', fields.pseudo)
    
    if (fields?.lastName) formData.append('lastName', fields.lastName)
    if (fields?.firstName) formData.append('firstName', fields.firstName)
    if (fields?.cartNumber) formData.append('cartNumber', fields.cartNumber)
    if (fields?.origin) formData.append('origin', fields.origin)
    if (fields?.blood) formData.append('blood', fields.blood)
    if (fields?.levelOfStudies) formData.append('levelOfStudies', fields.levelOfStudies)
    if (fields?.godFather) formData.append('godFather', fields.godFather)
    if (fields?.godFatherNum) formData.append('godFatherNum', fields.godFatherNum)
    if (fields?.province) formData.append('province', fields.province?.value)
    
    if (fields?.sex) formData.append('sex', fields.sex)
    if (fields?.maritalStatus) formData.append('maritalStatus', fields.maritalStatus)
    if (fields?.bornAt) formData.append('bornAt', fields.bornAt)
    if (fields?.email) formData.append('email', fields.email)
    if (fields?.phone) formData.append('phone', fields.phone)
    if (fields?.father) formData.append('father', fields.father)
    if (fields?.mother) formData.append('mother', fields.mother)
    if (fields?.conjoint) formData.append('conjoint', fields.conjoint)
    if (fields?.grade) formData.append('grade', fields.grade?.data)
    if (fields?.department) formData.append('department', fields.department?.value)
    if (fields?.service) formData.append('service', fields.service?.data)
    if (fields?.job) formData.append('job', fields.job?.data)
    if (fields?.conjointOrigin) formData.append('conjointOrigin', fields.conjointOrigin)
    if (fields?.file && fields.file.length > 0) formData.append('file', fields.file[0].file)
    if (fields?.children && fields.children.length > 0) {
      const children = fields.children.map(c => c)
      formData.append('children', JSON.stringify(children))
    }
    
    try {
      const send = data ? await editAgent(fields) : await postNewAgent(formData)
      if (send?.data) {
        toast.success(data ? 'Modification bien efféctuée.' : 'Enregistrement bien efféctué.')
        if (!data) onReset()
        navigate('/app/agents')
      }
      
      if (send?.error) {
        setValidated(true)
      }
    } catch (e) {
      toast.error('Problème de connexion.')
    }
  }
  
  useEffect(() => {
    if (data) {
      if (data?.profile) {
        setImage([{data_url: entrypoint+data.profile?.contentUrl}])
      }
      else setImage([])
      
      const job = data?.job
        ? {label: data.job.name.toUpperCase(), value: data.job.name.toUpperCase(), data: data.job['@id']}
        : null
      
      const service = data?.service
        ? {label: data.service.name.toUpperCase(), value: data.service.name.toUpperCase(), data: data.service['@id']}
        : null
      
      const grade = data?.grade
        ? {label: data.grade.name.toUpperCase(), value: data.grade.name.toUpperCase(), data: data.grade['@id']}
        : null
      
      const department = data?.department
        ? {label: data.department.name.toUpperCase(), value: data.department['@id']}
        : null
      
      const province = data?.province
        ? {label: data.province.name.toUpperCase(), value: data.province['@id']}
        : null
      
      setFields({
        id: data.id,
        name: data.name,
        sex: data?.sex ? data.sex : '',
        lastName: data?.lastName ? data.lastName : '',
        firstName: data?.firstName ? data.firstName : '',
        mother: data?.mother ? data.mother : '',
        cartNumber: data?.cartNumber ? data.cartNumber : '',
        conjointOrigin: data?.conjointOrigin ? data.conjointOrigin : '',
        godFatherNum: data?.godFatherNum ? data.godFatherNum : '',
        godFather: data?.godFather ? data.godFather : '',
        levelOfStudies: data?.levelOfStudies ? data.levelOfStudies : '',
        blood: data.blood ? data.blood : '',
        children: data?.children && data.children?.length > 0 ? data.children : [],
        conjoint: data?.conjoint ? data.conjoint : '',
        father: data?.father ? data.father : '',
        origin: data?.origin ? data.origin : '',
        phone: data?.phone,
        email: data?.email ? data.email : '',
        bornAt: data?.bornAt ? data.bornAt.substring(0, 10) : '',
        maritalStatus: data?.maritalStatus ? data.maritalStatus : '',
        pseudo: data.pseudo,
        register: data.register ? data.register : '',
        bornPlace: data?.bornPlace ? data.bornPlace : '',
        address: data?.addresses ? data.addresses : '',
        province,
        department,
        grade,
        service,
        job,
      })
    }
  }, [data]) // get existing data
  
  useEffect(() => {
    if (isError) {
      if (error) {
        if (error?.data) {
          const {violations} = error.data
          if (violations) violations.forEach(({ propertyPath, message }) => {
            setErrors(s => ({ ...s, [propertyPath]: message }))
          })
        }
      }
    }
    
    if (isEditError) {
      if (editError) {
        if (editError?.data) {
          const {violations} = editError.data
          if (violations) violations.forEach(({ propertyPath, message }) => {
            setErrors(s => ({ ...s, [propertyPath]: message }))
          })
        }
      }
    }
    
    if (isUpError) {
      if (upError?.error) toast.error(upError.error)
      if (upError?.data && upError.data['hydra:description']) toast.error(upError.data['hydra:description'])
    }
    
    if (isDelError) {
      if (delError?.error) toast.error(delError.error)
      if (delError?.data && delError.data['hydra:description']) toast.error(delError.data['hydra:description'])
    }
  }, [isError, error, isEditError, editError, isUpError, upError, isDelError, delError]) // errors
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <h4 className="card-title">
        <i className='bi bi-person-plus'/> Formulaire {data ? 'de modification' : "d'enregistrement"}
      </h4>
      
      <FieldsAlert/>
      
      <Form
        noValidate
        validated={validated}
        onSubmit={onSubmit}>
        <Row>
          <Col>
            <Row>
              <Col md={2}>
                {!data &&
                  <AddPatientImageField
                    loader={loader || isLoading || isEditLoading || isDeLoading || isUpdLoading}
                    images={fields.file}
                    onChange={onImageChange}/>}
                
                {data &&
                  <UpdateImageFields
                    loader={loader || isLoading || isEditLoading || isUpdLoading || isDeLoading}
                    images={image}
                    onChange={onUpdateImageChange}
                    onRemove={onRemoveImageChange}/>}
              </Col>
              
              <Col md={10}>
                <Row>
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='cartNumber'>N° de carte</Form.Label>
                    <Form.Control
                      autoFocus
                      isInvalid={errors.cartNumber !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='cartNumber'
                      name='cartNumber'
                      value={fields.cartNumber}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.cartNumber}/>
                  </Col>
                  
                  <Col  md={4} className='mb-3'>
                    <Form.Label htmlFor='register'><code>*</code> Matricule</Form.Label>
                    <Form.Control
                      required
                      isInvalid={errors.register !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='register'
                      name='register'
                      value={fields.register}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.register}/>
                  </Col>
                  
                  <Col  md={4} className='mb-3'>
                    <Form.Label htmlFor='pseudo'><code>*</code> Pseudo</Form.Label>
                    <Form.Control
                      required
                      isInvalid={errors.pseudo !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='pseudo'
                      name='pseudo'
                      value={fields.pseudo}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.pseudo}/>
                  </Col>
                  
                  <Col  md={4} className='mb-3'>
                    <Form.Label htmlFor='name'><code>*</code> Nom</Form.Label>
                    <Form.Control
                      required
                      isInvalid={errors.name !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='name'
                      name='name'
                      value={fields.name}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.name}/>
                  </Col>
                  
                  <Col  md={4} className='mb-3'>
                    <Form.Label htmlFor='lastName'>Postnom</Form.Label>
                    <Form.Control
                      isInvalid={errors.lastName !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='lastName'
                      name='lastName'
                      value={fields.lastName}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.lastName}/>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='firstName'>Prénom</Form.Label>
                    <Form.Control
                      isInvalid={errors.firstName !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='firstName'
                      name='firstName'
                      value={fields.firstName}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.firstName}/>
                  </Col>
                  
                  <Col  md={8} className='mb-3'>
                    <Form.Label>Lieu & date de naissance</Form.Label>
                    <InputGroup>
                      <Form.Control
                        isInvalid={errors.bornPlace !== null}
                        disabled={isLoading || loader || isEditLoading}
                        autoComplete='off'
                        id='bornPlace'
                        name='bornPlace'
                        value={fields.bornPlace}
                        onChange={e => onFieldChange(e, fields, setFields)}/>
                      
                      <Form.Control
                        type='date'
                        isInvalid={errors.bornAt !== null}
                        disabled={isLoading || loader || isEditLoading}
                        autoComplete='off'
                        id='bornAt'
                        name='bornAt'
                        value={fields.bornAt}
                        onChange={e => onFieldChange(e, fields, setFields)}/>
                      <FeedbackError error={errors.bornAt}/>
                    </InputGroup>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='sex'><code>*</code> Sexe</Form.Label>
                    <Form.Select
                      required
                      isInvalid={errors.sex !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='sex'
                      name='sex'
                      value={fields.sex}
                      onChange={e => onFieldChange(e, fields, setFields)}>
                      {sexOptions.length > 0 && sexOptions.map(s =>
                        <option key={s.value} value={s.value}>{s.label}</option>)}
                    </Form.Select>
                    <FeedbackError error={errors.sex}/>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='maritalStatus'><code>*</code> État-civil</Form.Label>
                    <Form.Select
                      required
                      isInvalid={errors.maritalStatus !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='maritalStatus'
                      name='maritalStatus'
                      value={fields.maritalStatus}
                      onChange={e => onFieldChange(e, fields, setFields)}>
                      {maritalStatusOptions.length > 0 && maritalStatusOptions.map(s =>
                        <option key={s.value} value={s.value}>{s.label}</option>)}
                    </Form.Select>
                    <FeedbackError error={errors.maritalStatus}/>
                  </Col>
                  
                  {/* -- */}
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='levelOfStudies'><code>*</code> Niveau d'étude</Form.Label>
                    <Form.Control
                      required
                      isInvalid={errors.levelOfStudies !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='levelOfStudies'
                      name='levelOfStudies'
                      value={fields.levelOfStudies}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.levelOfStudies}/>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='blood'><code>*</code> Groupe sanguin</Form.Label>
                    <Form.Select
                      required
                      isInvalid={errors.blood !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='blood'
                      name='blood'
                      value={fields.blood}
                      onChange={e => onFieldChange(e, fields, setFields)}>
                      {bloodOptions.length > 0 && bloodOptions.map(b =>
                        <option key={b.value} value={b.value}>{b.label}</option>)}
                    </Form.Select>
                    <FeedbackError error={errors.blood}/>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='origin'><code>*</code> Origine Province</Form.Label>
                    <Form.Control
                      required
                      isInvalid={errors.origin !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='origin'
                      name='origin'
                      value={fields.origin}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.origin}/>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='phone'>N° Tél</Form.Label>
                    <Form.Control
                      isInvalid={errors.phone !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='phone'
                      name='phone'
                      value={fields.phone}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.phone}/>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='email'>Email</Form.Label>
                    <Form.Control
                      isInvalid={errors.email !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      type='email'
                      id='email'
                      name='email'
                      value={fields.email}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.email}/>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='godFather'><code>*</code> Parrain</Form.Label>
                    <Form.Control
                      required
                      isInvalid={errors.email !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='godFather'
                      name='godFather'
                      value={fields.godFather}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.godFather}/>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='godFatherNum'><code>*</code> Contact du parrain</Form.Label>
                    <Form.Control
                      required
                      isInvalid={errors.godFatherNum !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='godFatherNum'
                      name='godFatherNum'
                      value={fields.godFatherNum}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.godFatherNum}/>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='department'><code>*</code> Provice</Form.Label>
                    <ReactSelectField
                      isAsync
                      disabled={isProvLoading || isLoading || loader || isEditLoading}
                      onChange={e => setFields({...fields, province: e})}
                      value={fields.province}
                      placeholder='-- --'
                      onLoadOptions={onLoadProvinces}
                      values={provOptions}/>
                    {errors?.province &&
                      <code><i className='bi bi-exclamation-circle-fill'/> {errors.province}</code>}
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='department'>Département</Form.Label>
                    <ReactSelectField
                      isAsync
                      disabled={isDepLoading || isLoading || loader || isEditLoading}
                      onChange={e => onDepartmentChange(e)}
                      value={fields.department}
                      placeholder='-- --'
                      onLoadOptions={onLoadDepartments}
                      values={depOptions}/>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='mother'>Grade</Form.Label>
                    <ReactSelectField
                      disabled={!fields.department || isLoading || loader || isEditLoading}
                      onChange={e => setFields({...fields, grade: e})}
                      value={fields.grade}
                      placeholder='-- --'
                      values={gradeOptions}/>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='mother'>Service</Form.Label>
                    <ReactSelectField
                      disabled={!fields.department || isLoading || loader || isEditLoading}
                      onChange={e => onServiceChange(e)}
                      value={fields.service}
                      placeholder='-- --'
                      values={serviceOptions}/>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='mother'>Fonction</Form.Label>
                    <ReactSelectField
                      disabled={!fields.service || isLoading || loader || isEditLoading}
                      onChange={e => setFields({...fields, job: e})}
                      value={fields.job}
                      placeholder='-- --'
                      values={jobOptions}/>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='father'>Père</Form.Label>
                    <Form.Control
                      isInvalid={errors.father !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='father'
                      name='father'
                      value={fields.father}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.father}/>
                  </Col>
                  
                  <Col md={4} className='mb-3'>
                    <Form.Label htmlFor='mother'>Mère</Form.Label>
                    <Form.Control
                      isInvalid={errors.mother !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='mother'
                      name='mother'
                      value={fields.mother}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.mother}/>
                  </Col>
                </Row>
                
                <div className='bg-light p-2 mb-3' style={{ border: '1px solid lightgray', borderRadius: 6 }}>
                  <Card.Title>Composition familiale</Card.Title>
                  
                  <div className='mb-3'>
                    <Form.Label htmlFor='conjoint'>Conjoint(e)</Form.Label>
                    <Form.Control
                      isInvalid={errors.conjoint !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      id='conjoint'
                      name='conjoint'
                      placeholder='Époux / Épouse'
                      value={fields.conjoint}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.conjoint}/>
                  </div>
                  
                  <div className='mb-3'>
                    <Form.Label htmlFor='conjointOrigin'>Origine (du / de la) conjoint(e)</Form.Label>
                    <Form.Control
                      isInvalid={errors.conjointOrigin !== null}
                      disabled={isLoading || loader || isEditLoading}
                      autoComplete='off'
                      as='textarea'
                      id='conjointOrigin'
                      name='conjointOrigin'
                      placeholder="Origine..."
                      value={fields.conjointOrigin}
                      onChange={e => onFieldChange(e, fields, setFields)}/>
                    <FeedbackError error={errors.conjointOrigin}/>
                  </div>
                  
                  <div>
                    <Form.Label>Enfant(s) :</Form.Label>
                    {fields.children.length > 0 && fields.children.map((c, i) =>
                      <Row key={i} className='mb-2'>
                        <Col className='mb-1'>
                          <Form.Control
                            disabled={isLoading || loader || isEditLoading}
                            size='sm'
                            autoComplete='off'
                            placeholder='Nom complet :'
                            name='name'
                            value={c.name}
                            onChange={e => onArrayChange(
                              e,
                              i,
                              'name',
                              fields.children,
                              fields,
                              setFields
                            )}/>
                        </Col>
                        
                        <Col className='mb-1'>
                          <Form.Control
                            disabled={isLoading || loader || isEditLoading}
                            size='sm'
                            autoComplete='off'
                            placeholder='Lieu de naissance :'
                            name='bornPlace'
                            value={c.bornPlace}
                            onChange={e => onArrayChange(
                              e,
                              i,
                              'bornPlace',
                              fields.children,
                              fields,
                              setFields
                            )}/>
                        </Col>
                        
                        <Col className='mb-1'>
                          <InputGroup>
                            <Form.Control
                              disabled={isLoading || loader || isEditLoading}
                              size='sm'
                              type='date'
                              placeholder='Date de naissance :'
                              name='bornAt'
                              value={c.bornAt}
                              onChange={e => onArrayChange(
                                e,
                                i,
                                'bornAt',
                                fields.children,
                                fields,
                                setFields
                              )}/>
                            <Button
                              disabled={isLoading || loader || isEditLoading}
                              type='button'
                              variant='danger'
                              size='sm'
                              onClick={() => onRemoveAgentItem(i)}>
                              <i className='bi bi-trash'/>
                            </Button>
                          </InputGroup>
                        </Col>
                      </Row>)}
                    
                    <Button
                      disabled={isLoading || loader || isEditLoading}
                      variant='dark'
                      type='button'
                      size='sm'
                      className='d-block w-100'
                      onClick={onAddAgentItem}>
                      Ajouter <i className='bi bi-plus'/>
                    </Button>
                  </div>
                </div>
                
                <div className='mb-3'>
                  <Form.Label htmlFor='address'>Adresse</Form.Label>
                  <Form.Control
                    isInvalid={errors.address !== null}
                    disabled={isLoading || loader || isEditLoading}
                    autoComplete='off'
                    as='textarea'
                    id='address'
                    name='address'
                    placeholder="Adresse physique de l'agent..."
                    value={fields.address}
                    onChange={e => onFieldChange(e, fields, setFields)}/>
                  <FeedbackError error={errors.address}/>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
        
        <div className='text-end'>
          {!data &&
            <Button
              disabled={isLoading || loader || isEditLoading}
              type='button'
              variant='light'
              onClick={onReset}
              className='me-1 mb-1'>
              <i className='bi bi-trash'/> Effacer
            </Button>}
          
          <Button disabled={isLoading || loader || isEditLoading} type='submit' className='mb-1'>
            {!(isLoading || isEditLoading) && <>{data ? 'Modifier' : 'Enregistrer'}</>}
            {(isLoading || isEditLoading) && <><Spinner animation='grow' size='sm'/> Veuillez patienter</>}
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}

AgentForm.propTypes = {
  data: PropTypes.any,
  loader: PropTypes.bool,
}
