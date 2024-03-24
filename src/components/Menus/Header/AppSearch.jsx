import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../index";
import {Button, Form} from "react-bootstrap";
import {useState} from "react";
import {onFieldChange} from "../../../services/form.handler.service";

export default function AppSearch() {
  const [search, setSearch] = useState({keywords: ''})
  
  function onSubmit(e) {
    e.preventDefault()
  }
  
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <div className='ms-lg-3 d-none d-md-none d-lg-block'>
        <Form onSubmit={onSubmit} className='d-flex align-items-center'>
          <i className='bi bi-search fs-4 lh-0 me-1'/>
          <Form.Control
            autoComplete='off'
            placeholder='Rechercher'
            className='border-0 shadow-none'
            name='keywords'
            value={search.keywords}
            onChange={e => onFieldChange(e, search, setSearch)}
          />
          <Button type='submit' hidden/>
        </Form>
      </div>
    </ErrorBoundary>
  )
}
