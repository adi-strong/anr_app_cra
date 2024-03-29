import {useEffect, useState} from "react";
import {editProvinceErrors, onHandleHideProvinceModal} from "../model/province.service";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError} from "../../../components";
import {Button, Form, Spinner} from "react-bootstrap";
import {onFieldChange} from "../../../services/form.handler.service";
import PropTypes from "prop-types";
import {useAddYearMutation, useEditYearMutation} from "../model/year.api.slice";
import toast from "react-hot-toast";

export default function YearForm({data, onRefresh, onHide}) {
  const [fields, setFields] = useState({name: ''})
  const [errors, setErrors] = useState(editProvinceErrors)
  const [addYear, {isLoading}] = useAddYearMutation()
  const [editYear, {isLoading: isEditLoading}] = useEditYearMutation()
  const [validated, setValidated] = useState(false)
  
  useEffect(() => {
    if (data) setFields({
      id: data.id,
      name: data.name
    })
  }, [data])
  
  const onSubmit = async (e) => {
    e.preventDefault()
    setValidated(false)
    setErrors(editProvinceErrors)
    try {
      const send = data ? await editYear(fields) : await addYear(fields)
      if (send?.data) {
        toast.success(data ? 'Modification bien efféctuée.' :'Enregistrement bien efféctuée.')
        setErrors(editProvinceErrors)
        if (!data) setFields({name: ''})
        onHide()
        
        onRefresh()
      }
    }
    catch (e) { toast.error('Problème de connexion.') }
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form noValidate validated={validated} onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label htmlFor='name'><code>*</code> Désignation</Form.Label>
          <Form.Control
            required
            disabled={isLoading || isEditLoading}
            isInvalid={errors.name !== null}
            autoComplete='off'
            id='name'
            name='name'
            value={fields.name}
            onChange={e => onFieldChange(e, fields, setFields)}/>
          <FeedbackError error={errors.name}/>
        </Form.Group>
        
        <hr/>
        <div className='text-end'>
          <Button
            disabled={isLoading || isEditLoading} variant='light' className='me-1'
            onClick={() => onHandleHideProvinceModal(data, setFields, setErrors, onHide)}>
            <i className='bi bi-x'/> Annuler
          </Button>
          
          <Button
            type='submit'
            disabled={isLoading || isEditLoading}>
            {!(isLoading || isEditLoading) && data && <i className='bi bi-pencil-square me-1'/>}
            {(isLoading || isEditLoading) && <Spinner animation='grow' size='sm' className='me-1'/>}
            {data ? 'Modifier' : 'Créer'}
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}

YearForm.propTypes = {
  data: PropTypes.any,
  onHide: PropTypes.func.isRequired,
}
