import {useEffect, useMemo, useState} from "react";
import {finCategories} from "../../finances/model/finances.service";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, ReactSelectField} from "../../../components";
import {Button, Form, InputGroup, Spinner} from "react-bootstrap";
import {onAddDepSubmit} from "../../configurations/model/department.service";
import {
  onAddExpenseCatItem, onExpCatReset,
  onExpenseCatItemChange,
  onRemoveExpenseCatItem
} from "../../finances/model/expense.categoy.service";
import PropTypes from "prop-types";
import {usePostNewJobMutation} from "../../jobs/model/job.api.service";
import {useGetServicesListQuery, useLazyGetLoadServicesQuery} from "../../configurations/model/department.api.slice";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";

export default function AddJobsForm({onHide, pages, onRefresh}) {
  const [validated, setValidated] = useState(false)
  const [fields, setFields] = useState(finCategories)
  const [postNewJob, {isLoading}] = usePostNewJobMutation()
  const [getLoadServices] = useLazyGetLoadServicesQuery()
  const [service, setService] = useState(null)
  
  const {nbPages} = useSelector(state => state.config)
  const {data: services=[], isSLoading, isSError, sError} = useGetServicesListQuery(nbPages)
  
  useEffect(() => {
    if (isSError) {
      if (sError?.error) toast.error(sError.error)
      if (sError?.data && sError.data['hydra:description']) toast.error(sError.data['hydra:description'])
    }
  }, [isSError, sError])
  
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
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form
        noValidate
        validated={validated}
        onSubmit={e => onAddDepSubmit(
          e,
          fields,
          setFields,
          postNewJob,
          onRefresh,
          onHide,
          setValidated,
          service
        )}>
        
        <div className='mb-3'>
          <Form.Label><code>*</code> Service</Form.Label>
          <ReactSelectField
            isAsync
            required
            disabled={isSLoading || isLoading}
            value={service}
            values={serviceOptions}
            onChange={e => setService(e)}
            onLoadOptions={onLoadServices}
            placeholder='-- --'/>
        </div>
        
        {fields.length > 0 && fields.map((f, i) =>
          <div key={i} className='mb-2'>
            <InputGroup className='mb-1'>
              <Form.Control
                required
                autoFocus
                disabled={isLoading}
                autoComplete='off'
                isInvalid={f.error.name !== null}
                name='name'
                value={f.name}
                onChange={e => onExpenseCatItemChange(e, i, fields, setFields)}
                placeholder='Nom du type...'/>
              {fields.length > 1 &&
                <Button
                  disabled={isLoading}
                  type='button'
                  variant='danger'
                  onClick={() => onRemoveExpenseCatItem(
                    i,
                    fields,
                    setFields
                  )}><i className='bi bi-dash'/></Button>}
            </InputGroup>
            <FeedbackError error={f.error.name}/>
          </div>)}
        {fields.length < 10 &&
          <Button
            type='button'
            variant='dark'
            disabled={isLoading}
            className='d-block w-100'
            onClick={() => onAddExpenseCatItem(
              fields,
              setFields
            )}><i className='bi bi-plus'/></Button>} <hr/>
        
        <div className='text-end'>
          <Button
            type='button'
            variant='light'
            className='me-1 mb-1'
            onClick={() => onExpCatReset(fields, setFields)}
            disabled={isLoading}>
            <i className='bi bi-trash'/> Effacer
          </Button>
          
          <Button type='submit' disabled={isLoading} className='mb-1'>
            {isLoading && <><Spinner animation='grow' size='sm' className='me-1'/> Veuillez patienter</>}
            {!isLoading && 'Enregistrer'}
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}

AddJobsForm.propTypes = { onHide: PropTypes.func.isRequired }
