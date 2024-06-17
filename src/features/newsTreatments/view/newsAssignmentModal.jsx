import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, ReactSelectField} from "../../../components";
import {Button, Form, Modal, Spinner} from "react-bootstrap";
import PropTypes from "prop-types";
import {
  useGetDepartmentsListQuery,
  useLazyGetLoadDepartmentsQuery
} from "../../configurations/model/department.api.slice";
import {useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {useEditNewsAssignmentMutation} from "../../news/services/news.api.slice";

export default function NewsAssignmentModal({ data, show, onHide }) {
  const [getLoadDepartments] = useLazyGetLoadDepartmentsQuery()
  const [department, setDepartment] = useState(null)
  const {nbPages} = useSelector(state => state.config)
  const {data: departments=[], isFetching, isError: isDepErr, error: depErr} = useGetDepartmentsListQuery(nbPages)
  const [editNews, {isLoading, isError, error}] = useEditNewsAssignmentMutation()
  
  async function onLoadDepartments(keywords): void {
    try {
      const search = await getLoadDepartments(keywords)
      if (search?.error) toast.error(search.error.error)
      else return search?.data
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  const onSubmit = async (): void => {
    try {
      await editNews({ department, id: data.id })
      toast.success('Affectation bien efféctué.')
      setDepartment(null)
      onHide()
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  let depOptions
  
  depOptions = useMemo(() => {
    let obj = []
    if (!isDepErr && departments.length > 0) {
      obj = departments.map(p => ({
        label: p?.name?.toUpperCase(),
        value: p['@id'],
      }))
    }
    
    return obj
  }, [isDepErr, departments])
  
  useEffect(() => {
    if (isDepErr) {
      if (depErr?.error) toast.error(depErr.error)
      if (depErr?.data && depErr.data['hydra:description']) {
        toast.error(depErr.data['hydra:description'])
      }
    }
  }, [isDepErr, depErr])
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      /*if (error?.data && error.data['hydra:description']) {
        toast.error(error.data['hydra:description'])
      }*/
    }
    
    if (data && data?.department) {
      setDepartment({
        label: data.department.name.toUpperCase(),
        value: data.department['@id']
      })
    }
  }, [isError, error, data])
  
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <Modal show={show} onHide={onHide}>
        <Modal.Header className='bg-primary' closeButton>
          <Modal.Title className='text-white'>
            <i className='bi bi-exclamation-circle-fill'/> Affectation
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <div>
            <Form.Label><code>*</code> Champ d'affectation :</Form.Label>
            <ReactSelectField
              isAsync
              required
              disabled={isFetching || isLoading}
              values={depOptions}
              value={department}
              onLoadOptions={onLoadDepartments}
              onChange={e => setDepartment(e)}
              placeholder='-- Sélection du Département --'
            />
          </div>
        </Modal.Body>
        
        <Modal.Footer className='bg-light-primary'>
          <Button disabled={isLoading} variant='light' onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          
          <Button disabled={isLoading} onClick={onSubmit}>
            {!isLoading && <i className='bi bi-check me-1'/>}
            {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
            {isLoading ? 'Veuillez patienter' : 'Valider'}
          </Button>
        </Modal.Footer>
      </Modal>
    </ErrorBoundary>
  )
}

NewsAssignmentModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
}
