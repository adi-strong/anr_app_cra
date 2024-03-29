import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError} from "../../../components";
import {useState} from "react";
import {finCategories} from "../model/finances.service";
import PropTypes from "prop-types";
import {Button, Form, InputGroup, Spinner} from "react-bootstrap";
import {
  onAddExpenseCatItem, onExpCatReset,
  onExpenseCatItemChange,
  onRemoveExpenseCatItem
} from "../model/expense.categoy.service";
import {onAddDepSubmit} from "../../configurations/model/department.service";
import {useAddExpTypeMutation} from "../model/exp.type.api.slice";

export default function AddExpenseCategoriesForm({onHide, pages, onRefresh}) {
  const [validated, setValidated] = useState(false)
  const [fields, setFields] = useState(finCategories)
  const [addExpType, {isLoading}] = useAddExpTypeMutation()
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form
        noValidate
        validated={validated}
        onSubmit={e => onAddDepSubmit(
          e,
          fields,
          setFields,
          addExpType,
          onRefresh,
          onHide,
          setValidated
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
                placeholder='Type de dépenses...'/>
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

AddExpenseCategoriesForm.propTypes = { onHide: PropTypes.func.isRequired }
