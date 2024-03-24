import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender} from "../../../components";
import {Button, Col, Form, Row, Table} from "react-bootstrap";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import {onFieldChange} from "../../../services/form.handler.service";
import {rdvItems} from "../model/rendez.vous.service";
import RdvFileItem from "./rdvFileItem";
import RdvFileForm from "./rdvFileForm";

export default function RendezVousFilesList() {
  const [search, setSearch] = useState({keyword: ''})
  const [show, setShow] = useState(false)
  
  const dispatch = useDispatch()
  
  const {nbPages} = useSelector(state => state.config)
  
  const toggleShow = () => setShow(!show)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Row>
        <Col md={6} className='mb-2 d-flex'>
          <Button disabled={false} variant='dark' className='me-1 mb-1'>
            <i className='bi bi-printer'/> Imprimer
          </Button>
          
          <Button disabled={false} className='me-1 mb-1' onClick={toggleShow}>
            Ajouter <i className='bi bi-chevron-double-right'/>
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
      
      <div>
        <Table className='text-nowrap'>
          <thead>
          <tr>
            {rdvItems.map(t =>
              <th key={t.label} className='align-middle'>
                {t.label}
              </th>)}
            <th className='text-end text-primary'/>
          </tr>
          </thead>
          
          <tbody>
          <RdvFileItem/>
          </tbody>
        </Table>
      </div>
      
      <AppOffCanvas
        show={show}
        onHide={toggleShow}
        title={<><i className='bi bi-plus'/> Rendez-vous</>}
        children={<RdvFileForm onHide={toggleShow}/>}/>
    </ErrorBoundary>
  )
}
