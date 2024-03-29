import {useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError} from "../../../components";
import {Button, Form, InputGroup, Spinner} from "react-bootstrap";
import {
  onExpenseCatItemChange,
  onRemoveExpenseCatItem
} from "../../finances/model/expense.categoy.service";
import PropTypes from "prop-types";
import {provinceFields, onAddTypeItem, onAddProvinceSubmit} from "../model/province.service";
import {useAddProvinceMutation} from "../model/province.api.slice";

export default function AddProvincesForm({onHide, pages, onRefresh}) {
  const [validated, setValidated] = useState(false)
  const [fields, setFields] = useState(provinceFields)
  const [addProvince, {isLoading}] = useAddProvinceMutation()
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Form
        noValidate
        validated={validated}
        onSubmit={e => onAddProvinceSubmit(
          e,
          fields,
          setFields,
          addProvince,
          onRefresh,
          onHide,
          setValidated
        )}>
        
        {fields.length > 0 && fields.map((f, i) =>
          <div key={i} className='mb-1'>
            <Form.Text><code>*</code> Province</Form.Text>
            <InputGroup className='mb-1'>
              <Form.Control
                required
                autoFocus
                disabled={isLoading}
                autoComplete='off'
                size='sm'
                isInvalid={f.errors.name !== null}
                name='name'
                value={f.name}
                onChange={e => onExpenseCatItemChange(e, i, fields, setFields)}/>
              {fields.length > 1 &&
                <Button
                  disabled={isLoading}
                  style={{ height: 29.69 }}
                  type='button'
                  variant='danger'
                  onClick={() => onRemoveExpenseCatItem(
                    i,
                    fields,
                    setFields
                  )}><i className='bi bi-dash'/></Button>}
            </InputGroup>
            <FeedbackError error={f.errors.name}/>
          </div>)}
        {fields.length < 10 &&
          <Button
            type='button'
            size='sm'
            variant='dark'
            disabled={isLoading}
            className='d-block w-100 mt-2'
            onClick={() => onAddTypeItem(
              fields,
              setFields
            )}><i className='bi bi-plus'/></Button>} <hr/>
        
        <div className='text-end'>
          <Button
            type='button'
            variant='light'
            className='me-1 mb-1'
            onClick={() => {}}
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

AddProvincesForm.propTypes = { onHide: PropTypes.func.isRequired }
