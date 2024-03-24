import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender} from "../../../components";
import {Button, Card, Col, Form, Row, Table} from "react-bootstrap";
import {useState} from "react";
import {covenantItems} from "../model/patients.service";
import {onFieldChange} from "../../../services/form.handler.service";
import {useDispatch, useSelector} from "react-redux";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import CovenantForm from "./covenantForm";
import CovenantItem from "./covenantItem";

export default function CovenantsList() {
  const [thItems] = useState(covenantItems)
  const [search, setSearch] = useState({keyword: ''})
  const [open, setOpen] = useState(false)
  
  const dispatch = useDispatch()
  
  const {nbPages} = useSelector(state => state.config)
  
  const toggleOpen = () => setOpen(!open)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Card.Header className='bg-white pt-5'>
        <Card.Title>
          <i className='bi bi-arrow-clockwise text-primary me-1' style={{ cursor: 'pointer' }}/>
          Liste de conventions
        </Card.Title>
        
        <Row>
          <Col md={6} className='mb-2 d-flex'>
            <Button disabled={false} variant='dark' className='me-1 mb-1'>
              <i className='bi bi-printer'/> Imprimer
            </Button>
            
            <Button className='me-1 mb-1' onClick={toggleOpen}>
              Enregistrement <i className='bi bi-chevron-double-right'/>
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
            <div className='justify-content-md-end'>
              <Form onSubmit={e => e.preventDefault()}>
                <Form.Control
                  disabled={false}
                  name='keyword'
                  placeholder='Rechercher'
                  value={search.keyword}
                  onChange={e => onFieldChange(e, search, setSearch)}/>
              </Form>
            </div>
          </Col>
        </Row>
      </Card.Header>
      
      <div>
        <Table className='text-nowrap'>
          <thead className='table-light'>
          <tr>
            {thItems.map(t =>
              <th key={t.label} className='align-middle'>
                {t.label}
              </th>)}
            <th className='align-middle'/>
          </tr>
          </thead>
          
          <tbody>
          <CovenantItem/>
          </tbody>
        </Table>
      </div>
      
      <AppOffCanvas
        show={open}
        onHide={toggleOpen}
        title={<><i className='bi bi-plus'/> Enregistrement convention</>}
        children={<CovenantForm/>}/>
    </ErrorBoundary>
  )
}
