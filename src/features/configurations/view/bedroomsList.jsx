import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender} from "../../../components";
import {Button, Card, Col, Form, Row, Table} from "react-bootstrap";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import {onFieldChange} from "../../../services/form.handler.service";
import ConsultationTypeItem from "./ConsultationTypeItem";
import {bedroomItems} from "../model/bed.service";
import AddBedsForm from "./addBedsForm";

export default function BedroomsList() {
  const [search, setSearch] = useState({keyword: ''})
  const [show, setShow] = useState(false)
  
  const dispatch = useDispatch()
  
  const {nbPages} = useSelector(state => state.config)
  
  const toggleShow = () => setShow(!show)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Card.Header className='bg-white'>
        <i
          className='me-1 text-primary bi bi-arrow-clockwise'
          style={{ cursor: 'pointer' }}/>
        Liste de chambres
        
        <Row className='mt-4'>
          <Col md={6} className='mb-2 d-flex'>
            <Button disabled={false} variant='info' className='me-1 mb-1 text-light' onClick={toggleShow}>
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
      </Card.Header>
      
      <div>
        <Table className='text-nowrap'>
          <thead className='table-light'>
          <tr>
            {bedroomItems.map(t =>
              <th key={t.label} className='align-middle'>
                {t.label}
              </th>)}
            <th className='text-end text-primary'/>
          </tr>
          </thead>
          
          <tbody>
          <ConsultationTypeItem/>
          </tbody>
        </Table>
      </div>
      
      <AppOffCanvas
        show={show}
        onHide={toggleShow}
        title={<><i className='bi bi-plus'/> Enregistrement chambre(s)</>}
        children={<AddBedsForm onHide={toggleShow}/>}/>
    </ErrorBoundary>
  )
}
