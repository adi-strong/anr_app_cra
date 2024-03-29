import {useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError} from "../../../components";
import {Button, Form, InputGroup, Spinner} from "react-bootstrap";
import PropTypes from "prop-types";
import {finCategories} from "../../finances/model/finances.service";
import {useAddServiceMutation} from "../model/department.api.slice";
import {
  onAddExpenseCatItem, onExpCatReset,
  onExpenseCatItemChange,
  onRemoveExpenseCatItem
} from "../../finances/model/expense.categoy.service";
import {onAddServSubmit} from "../model/department.service";

export default function AddServicesForm({onHide, data, department, onRefresh}) {
  const [validated, setValidated] = useState(false)
  const [fields, setFields] = useState(finCategories)
  const [addService, {isLoading}] = useAddServiceMutation()
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form
        noValidate
        validated={validated}
        onSubmit={e => onAddServSubmit(
          e,
          fields,
          setFields,
          addService,
          onRefresh,
          onHide,
          setValidated,
          department['@id']
        )}>
        
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
                placeholder='Nom du service...'/>
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

AddServicesForm.propTypes = { onHide: PropTypes.func.isRequired }
