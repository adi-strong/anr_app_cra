import {useEffect, useMemo, useState} from "react";
import {salaryErrors} from "../../salaries/model/salary.service";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, FieldsAlert, ReactSelectField} from "../../../components";
import {Button, Col, Form, Modal, Row, Spinner} from "react-bootstrap";
import PropTypes from "prop-types";
import {folderErrors, folderFields} from "../model/folder.service";
import {useGetFolderTypesListQuery, useLazyGetLoadFolderTypesQuery} from "../model/folder.type.api.slice";
import {usePostNewFolderMutation} from "../../staff/model/folder.api.slice";
import {onFieldChange} from "../../../services/form.handler.service";

export default function AddFolderModal({show, onHide, agent, onRefresh}) {
  const [open, setOpen] = useState(false)
  const [fields, setFields] = useState(folderFields)
  const [errors, setErrors] = useState(folderErrors)
  const [postNewFolder, {isLoading, isError, error}] = usePostNewFolderMutation()
  const [getLoadFolderTypes] = useLazyGetLoadFolderTypesQuery()
  
  const {nbPages} = useSelector(state => state.config)
  const {data: folderTypes=[], isError: isFTError, isLoading: isFTLoading} = useGetFolderTypesListQuery(nbPages)
  
  let folderTypeOptions
  
  folderTypeOptions = useMemo(() => {
    let obj= []
    if (!isFTError && folderTypes.length > 0) obj = folderTypes.map(p => ({
      label: p?.name,
      value: p['@id'],
    }))
    
    return obj
  }, [isFTError, folderTypes])
  
  const toggleOpen = () => setOpen(!open)
  
  const onReset = () => {
    setErrors(folderErrors)
    setFields(folderFields)
  }
  
  async function onLoadFolderTypes(keywords) {
    try {
      const search = await getLoadFolderTypes(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onSubmit = async () => {
    setErrors(salaryErrors)
    if (agent) {
      const formData = new FormData()
      if (fields?.type) formData.append('type', fields.type?.value)
      if (fields?.file) formData.append('file', fields.file)
      formData.append('agent', agent['@id'])
      
      try {
        const send = await postNewFolder(formData)
        if (send?.data) {
          toast.success('Opération bien efféctuée.')
          onReset()
          onHide()
          onRefresh()
        }
      }
      catch (e) { toast.error('Problème de connexion.') }
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
          <Modal.Title><i className='bi bi-plus'/> Nouveau dossier</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <FieldsAlert/>
          
          <Row>
            <Col className='mb-3'>
              <Form.Label><code>*</code> Type de dossier</Form.Label>
              <ReactSelectField
                isAsync
                disabled={isLoading || isFTLoading}
                value={fields.type}
                onChange={e => setFields({...fields, type: e})}
                onLoadOptions={onLoadFolderTypes}
                values={folderTypeOptions}
                placeholder='-- --'/>
              {errors?.type && <code><i className='bi bi-exclamation-circle-fill'/> {errors.type}</code>}
            </Col>
            
            <Col className='mb-3'>
              <Form.Label htmlFor='file'><code>*</code> Dossier</Form.Label>
              <Form.Text className='mx-1'>(<i className='bi bi-file-text'/> fichier à insérer)</Form.Text>
              <Form.Control
                isInvalid={errors.file !== null}
                disabled={isLoading}
                autoComplete='off'
                type='file'
                accept='.doc, .pdf, .docx, .xls, .xlsx'
                id='file'
                name='file'
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.file}/>
            </Col>
          </Row>
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

AddFolderModal.propTypes = {
  agent: PropTypes.any,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
}
