import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Card, Col, Form, Row, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import {onFieldChange} from "../../../services/form.handler.service";
import {agentItems} from "../model/agent.service";
import AgentItem from "./agentItem";

export default function AgentsList() {
  const [search, setSearch] = useState({keyword: ''})
  
  const dispatch = useDispatch()
  
  const {nbPages} = useSelector(state => state.config)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Card.Header className='bg-white pt-5'>
        <Card.Title>
          <i className='me-1 bi bi-arrow-clockwise text-primary'/>
          Liste des agents
        </Card.Title>
        
        <Row>
          <Col md={6} className='mb-2 d-flex'>
            <Button disabled={false} variant='dark' className='me-1 mb-1'>
              <i className='bi bi-printer'/> Imprimer
            </Button>
            
            <Link to='/app/agents/add' className='btn btn-primary me-1 mb-1'>
              Enregistrement
            </Link>
            
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
            {agentItems.map(t =>
              <th key={t.label} className='align-middle'>
                {t.label}
              </th>)}
            <th className='text-end text-primary'>
              <i className='bi bi-arrow-clockwise' style={{ cursor: 'pointer' }}/>
            </th>
          </tr>
          </thead>
          
          <tbody>
          <AgentItem/>
          </tbody>
        </Table>
      </div>
    </ErrorBoundary>
  )
}
