import {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError} from "../../../components";
import {Button, Form, Spinner} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import PropTypes from "prop-types";
import {useEditPropertyTypeMutation} from "../../properties/model/property.type.api.slice";

export default function EditPropertyForm({data, onRefresh, onHide}) {
  const [fields, setFields] = useState({name: ''})
  const [errors, setErrors] = useState({name: null})
  const [validate, setValidate] = useState(false)
  const [editPropertyType, {isLoading, isError, error}] = useEditPropertyTypeMutation()
  
  useEffect(() => {
    if (data) {
      setFields({
        name: data.name,
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
  }, [isError, error])
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setErrors({name: null})
    setValidate(false)
    try {
      const send = await editPropertyType(fields)
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
        <Form.Label htmlFor='name'><code>*</code> Type</Form.Label>
        <Form.Control
          disabled={isLoading}
          isInvalid={errors.name !== null}
          autoComplete='off'
          id='name'
          name='name'
          value={fields.name}
          onChange={e => onFieldChange(e, fields, setFields)}/>
        <FeedbackError error={errors.name}/> <hr/>
        
        <Button disabled={isLoading} type='submit' className='d-block w-100'>
          {isLoading && <Spinner animation='grow' size='sm' className='me-1'/>}
          {!isLoading && <i className='bi bi-pencil-square me-1'/>}
          {isLoading ? 'Veuillez patienter' : 'Modifier'}
        </Button>
      </Form>
    </ErrorBoundary>
  )
}

EditPropertyForm.propTypes = {
  data: PropTypes.any,
  onRefresh: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}
