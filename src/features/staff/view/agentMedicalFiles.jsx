import {useDispatch, useSelector} from "react-redux";
import {useMemo, useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Button, Card, Col, Form, Row, Table} from "react-bootstrap";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import SimplePagination from "../../../components/paginations/SimplePagination";
import {FadeSpinLoader} from "../../../loaders";
import {medicalItems} from "../../medical/model/medical.service";
import MedicalItem from "../../medical/view/medicalItem";
import AddMedicalModal from "../../medical/view/addMedicalModal";

export default function AgentMedicalFiles({agent, isError, loader, onRefresh}) {
  const dispatch = useDispatch()
  
  const [show, setShow] = useState(false)
  
  const toggleShow = () => setShow(!show)
  
  const {nbPages} = useSelector(state => state.config)
  
  let medicals, currentItems
  medicals = useMemo(() => {
    let obj = []
    if (!isError && agent && agent?.medicals && agent.medicals?.length > 0) {
      const items = agent.medicals
      obj = items.map(m => m)
    }
    
    return obj
  }, [isError, agent])
  
  const [itemOffset, setItemOffset] = useState(0)
  
  const endOffset = itemOffset + nbPages
  
  currentItems = useMemo(() => {
    return medicals?.slice(itemOffset, endOffset)
  }, [medicals, endOffset, itemOffset])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Col xxl={12}>
        <Card>
          <Card.Body>
            <h4 className="card-title mt-3">Fiches médicales</h4>
            
            <Row>
              <Col md={6} className='mb-3 d-flex'>
                <div className='me-2' style={{ width: 150 }}>
                  <Form.Select
                    disabled={loader}
                    value={nbPages}
                    onChange={({target}) => dispatch(onSetNbPages(target.value))}>
                    {nbPageOptions.map(o =>
                      <option key={o.value} value={o.value}>{o.label}</option>)}
                  </Form.Select>
                </div>
              </Col>
              
              <Col md={6} className='mb-3 text-md-end'>
                <Button disabled={loader} onClick={toggleShow} variant='outline-primary'>
                  <i className='bi bi-plus'/> Nouvelle fiche
                </Button>
              </Col>
            </Row>
            
            <div>
              <Table responsive>
                <thead className='bg-primary'>
                <tr>
                  {medicalItems.length > 0 && medicalItems.map(t =>
                    <th key={t.label} className='align-middle text-white'>{t.label}</th>)}
                  <th className='align-middle'/>
                </tr>
                </thead>
                
                <tbody>
                {currentItems && currentItems?.length > 0 && currentItems?.map(m =>
                  <MedicalItem key={m.id} data={m}/>)}
                </tbody>
              </Table>
              
              <div className='mt-3 px-3 pe-3'>
                <SimplePagination
                  items={medicals}
                  setItemOffset={setItemOffset}
                  itemsPerPage={nbPages}/>
              </div>
            </div>
            
            {loader && <FadeSpinLoader loading={loader}/>}
          </Card.Body>
        </Card>
      </Col>
      
      {agent && <AddMedicalModal onRefresh={onRefresh} show={show} onHide={toggleShow} agent={agent}/>}
    </ErrorBoundary>
  )
}
