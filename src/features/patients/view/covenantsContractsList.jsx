import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {Button, Card, Col, Form, Row, Table} from "react-bootstrap";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import {covContractItems} from "../model/covenant.service";
import CovenantContractItem from "./CovenantContractItem";
import {useState} from "react";
import CovenantContractForm from "./covenantContractForm";

export default function CovenantsContractsList() {
  const dispatch = useDispatch()
  
  const {nbPages} = useSelector(state => state.config)
  
  const [show, setShow] = useState(false)
  
  const toggleShow = () => setShow(!show)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Card.Header className='bg-white pt-5'>
        <Card.Title>
          <i className='bi bi-arrow-clockwise text-primary me-1' style={{ cursor: 'pointer' }}/>
          Contrats
        </Card.Title>
        
        <Row>
          <Col md={10} className='mb-2 d-flex'>
            <Button disabled={false} className='me-1 mb-1' onClick={toggleShow}>
              <i className='bi bi-cloud-upload'/> Nouveau Contrat <i className='bi bi-chevron-double-right'/>
            </Button>
          </Col>
          
          <Col className='mb-2'>
            <div className='justify-content-md-end'>
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
            </div>
          </Col>
        </Row>
      </Card.Header>
      
      <div>
        <Table className='text-nowrap'>
          <thead className='table-light'>
          <tr>
            {covContractItems.length && covContractItems.map(t =>
              <th key={t.label} className='align-middle'>
                {t.label}
              </th>)}
            <th className='text-end text-primary'/>
          </tr>
          </thead>
          
          <tbody>
          <CovenantContractItem/>
          </tbody>
        </Table>
      </div>
      
      <AppOffCanvas
        show={show}
        onHide={toggleShow}
        title={<><i className='bi bi-paperclip'/> Nouveau contrat</>}
        children={<CovenantContractForm onHide={toggleShow}/>}/>
    </ErrorBoundary>
  )
}
