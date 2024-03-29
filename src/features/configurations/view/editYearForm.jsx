import {useEffect, useState} from "react";
import {useEditYearMutation} from "../model/year.api.slice";
import toast from "react-hot-toast";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Button, Form, Spinner} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import PropTypes from "prop-types";

export default function EditYearForm({data, onRefresh, onHide}) {
  const [fields, setFields] = useState({isActive: false, id: null})
  const [editYear, {isLoading}] = useEditYearMutation()
  const [validated, setValidated] = useState(false)
  
  useEffect(() => {
    if (data) setFields({
      id: data.id,
      isActive: data?.isActive,
    })
  }, [data])
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setValidated(false)
    onHide()
    try {
      const send = editYear(fields)
      if (send?.data) {
        toast.success('Modification bien efféctuée.')
        onRefresh()
      }
    }
    catch (e) { toast.error('Problème de connexion.') }
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form noValidate validated={validated} onSubmit={onSubmit}>
        <Form.Group>
          <Form.Switch
            required
            disabled={isLoading}
            autoComplete='off'
            type='checkbox'
            id='isActive'
            name='isActive'
            checked={fields.isActive}
            label={<><code>*</code> Activer / Désactiver</>}
            value={fields.isActive}
            onChange={e => onFieldChange(e, fields, setFields)}/>
        </Form.Group>
        
        <hr/>
        <div className='text-end'>
          <Button disabled={isLoading} variant='light' className='me-1' onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          
          <Button
            type='submit'
            disabled={isLoading}>
            {!isLoading && <i className='bi bi-pencil-square me-1'/>}
            {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
            Modifier
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}

EditYearForm.propTypes = {
  data: PropTypes.any,
  onHide: PropTypes.func.isRequired,
}
