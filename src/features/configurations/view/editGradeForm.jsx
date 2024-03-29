import {useEffect, useState} from "react";
import {editProvinceErrors, editProvinceFields, onHandleHideProvinceModal} from "../model/province.service";
import {useEditGradeMutation} from "../model/department.api.slice";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError} from "../../../components";
import {Button, Form, Spinner} from "react-bootstrap";
import {onEditDepSubmit} from "../model/department.service";
import {onFieldChange} from "../../../services/form.handler.service";
import PropTypes from "prop-types";

export default function EditGradeForm({data, onRefresh, onHide}) {
  const [province, setProvince] = useState(editProvinceFields)
  const [errors, setErrors] = useState(editProvinceErrors)
  const [editGrade, {isLoading}] = useEditGradeMutation()
  const [validated, setValidated] = useState(false)
  
  useEffect(() => {
    if (data) setProvince({
      id: data.id,
      name: data.name
    })
  }, [data])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form noValidate validated={validated} onSubmit={e => onEditDepSubmit(
        e,
        province,
        editGrade,
        errors,
        setErrors,
        onRefresh,
        onHide,
        setValidated
      )}>
        <Form.Group>
          <Form.Label htmlFor='name'><code>*</code> Nom du département</Form.Label>
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

EditGradeForm.propTypes = {
  data: PropTypes.any,
  onHide: PropTypes.func.isRequired,
}
