import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError} from "../../../components";
import {useEffect, useState} from "react";
import {
  editProvinceErrors,
  editProvinceFields,
  onEditProvinceSubmit,
  onHandleHideProvinceModal
} from "../model/province.service";
import PropTypes from "prop-types";
import {Button, Form, Spinner} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import {useEditProvinceMutation} from "../model/province.api.slice";

export default function EditProvinceForm({data, onRefresh, onHide}) {
  const [province, setProvince] = useState(editProvinceFields)
  const [errors, setErrors] = useState(editProvinceErrors)
  const [editProvince, {isLoading}] = useEditProvinceMutation()
  const [validated, setValidated] = useState(false)
  
  useEffect(() => {
    if (data) setProvince({
      id: data.id,
      name: data.name
    })
  }, [data])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form noValidate validated={validated} onSubmit={e => onEditProvinceSubmit(
        e,
        province,
        editProvince,
        errors,
        setErrors,
        onRefresh,
        onHide,
        setValidated
      )}>
        <Form.Group>
          <Form.Label htmlFor='name'><code>*</code> Nom de la province</Form.Label>
          <Form.Control
            required
            disabled={isLoading}
            isInvalid={errors.name !== null}
            autoComplete='off'
            id='name'
            name='name'
            value={province.name}
            onChange={e => onFieldChange(e, province, setProvince)}/>
          <FeedbackError error={errors.name}/>
        </Form.Group>
        
        <hr/>
        <div className='text-end'>
          <Button
            disabled={isLoading} variant='light' className='me-1'
            onClick={() => onHandleHideProvinceModal(data, setProvince, setErrors, onHide)}>
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

EditProvinceForm.propTypes = {
  data: PropTypes.any,
  onHide: PropTypes.func.isRequired,
}
