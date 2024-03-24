import {useState} from "react";
import {finCategories} from "../../finances/model/finances.service";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError} from "../../../components";
import {Button, Form, InputGroup} from "react-bootstrap";
import {
  onAddExpenseCatItem, onExpCatReset,
  onExpCatSubmit,
  onExpenseCatItemChange,
  onRemoveExpenseCatItem
} from "../../finances/model/expense.categoy.service";
import PropTypes from "prop-types";

export default function AddDepartmentsForm({onHide}) {
  const [validated, setValidated] = useState(false)
  const [fields, setFields] = useState(finCategories)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form
        noValidate
        validated={validated}
        onSubmit={e => onExpCatSubmit(
          e,
          fields,
          setFields,
          setValidated
        )}>
        
        {fields.length > 0 && fields.map((f, i) =>
          <div key={i} className='mb-2'>
            <InputGroup className='mb-1'>
              <Form.Control
                required
                autoFocus
                disabled={false}
                autoComplete='off'
                isInvalid={f.error.name !== null}
                name='name'
                value={f.name}
                onChange={e => onExpenseCatItemChange(e, i, fields, setFields)}
                placeholder='Nom du département...'/>
              {fields.length > 1 &&
                <Button
                  disabled={false}
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
            disabled={false}
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
            disabled={false}>
            <i className='bi bi-trash'/> Effacer
          </Button>
          
          <Button type='submit' disabled={false} className='mb-1'>
            Enregistrer
          </Button>
        </div>
      </Form>
    </ErrorBoundary>
  )
}

AddDepartmentsForm.propTypes = { onHide: PropTypes.func.isRequired }
