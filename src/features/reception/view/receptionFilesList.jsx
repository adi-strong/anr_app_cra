import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Button, Col, Form, Row, Table} from "react-bootstrap";
import {useState} from "react";
import {fileItems} from "../model";
import {onFieldChange} from "../../../services/form.handler.service";
import {useDispatch, useSelector} from "react-redux";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import ReceptionItem from "./receptionItem";

export default function ReceptionFilesList() {
  const [thItems] = useState(fileItems)
  const [search, setSearch] = useState({start: '', end: ''})
  
  const dispatch = useDispatch()
  
  const {nbPages} = useSelector(state => state.config)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Row>
        <Col md={6} className='mb-2 d-flex'>
          <Button disabled={false} className='me-2 mb-1'>
            <i className='bi bi-printer'/> Imprimer
          </Button>
          
          <Form.Group className='mb-1'>
            <Form.Select
              disabled={false}
              value={nbPages}
              onChange={({target}) =>
                dispatch(onSetNbPages(target.value))}
              onClick={() => {}}>
              {nbPageOptions.map(o =>
                <option key={o.value} value={o.value}>{o.label}</option>)}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col className='mb-2'>
          <div className='justify-content-end'>
            <Form
              onSubmit={e => e.preventDefault()}
              className='d-flex'>
              <Form.Control
                disabled={false}
                type='date'
                name='start'
                className='me-2'
                value={search.start}
                onChange={e => onFieldChange(e, search, setSearch)}/>
              
              <Form.Control
                disabled={false}
                type='date'
                name='end'
                value={search.end}
                onChange={e => onFieldChange(e, search, setSearch)}/>
            </Form>
          </div>
        </Col>
      </Row>
      
      <div className='container-fluid'>
        <Table>
          <thead>
          <tr>
            {thItems.map(t =>
              <th key={t.key} className='align-middle'>
                {t.label}
              </th>)}
            <th className='align-middle'/>
          </tr>
          </thead>
          
          <tbody>
          <ReceptionItem/>
          </tbody>
        </Table>
      </div>
    </ErrorBoundary>
  )
}
