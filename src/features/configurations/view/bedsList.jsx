import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender} from "../../../components";
import {Badge, Button, Card, Col, Form, Row} from "react-bootstrap";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import {onFieldChange} from "../../../services/form.handler.service";
import placeholderImg from '../../../assets/images/placeholder/placeholder-4by3.svg';
import BedForm from "./bedForm";

export default function BedsList() {
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
        Liste de lits d'hospitalisation
        
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
      
      <Card.Body>
        <Row>
          <Col md={4} className='mb-3'>
            <Card>
              <Card.Img src={placeholderImg} className='card-img-top'/>
              <Card.Body className='text-center'>
                <h5 className='card-title h3'>a-005</h5>
                <p className='card-text fw-bold'>
                  <i className='bi bi-cash-coin me-1'/>
                  12 $ / 1297 FC
                </p>
                
                <p>
                  <Badge bg='success'>
                    <i className='bi bi-check-circle-fill'/> Disponible
                  </Badge>
                </p>
                
                <Card.Link style={{ cursor: 'pointer' }}>
                  <i className='bi bi-pencil-square'/> Modifier
                </Card.Link>
                
                <Card.Link style={{ cursor: 'pointer' }} className='text-danger'>
                  <i className='bi bi-trash'/> Supprimer
                </Card.Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Card.Body>
      
      <AppOffCanvas
        show={show}
        onHide={toggleShow}
        title={<><i className='bi bi-plus'/> Enregistrement lit</>}
        children={<BedForm onHide={toggleShow}/>}/>
    </ErrorBoundary>
  )
}
