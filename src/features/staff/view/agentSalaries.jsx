import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Button, Card, Col, Form, Row, Table} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import {useMemo, useState} from "react";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import SimplePagination from "../../../components/paginations/SimplePagination";
import {FadeSpinLoader} from "../../../loaders";
import {salaryItems} from "../../salaries/model/salary.service";
import AgentSalaryItem from "../../salaries/view/agentSalaryItem";
import AddSalaryModal from "../../salaries/view/addSalaryModal";

export default function AgentSalaries({agent, isError, loader, onRefresh}) {
  const dispatch = useDispatch()
  
  const [show, setShow] = useState(false)
  
  const toggleShow = () => setShow(!show)
  
  const {nbPages} = useSelector(state => state.config)
  
  let salaries, currentItems
  salaries = useMemo(() => {
    let obj = []
    if (!isError && agent && agent?.salaries && agent.salaries?.length > 0) {
      const items = agent.salaries
      obj = items.map(m => m)
    }
    
    return obj
  }, [isError, agent])
  
  const [itemOffset, setItemOffset] = useState(0)
  
  const endOffset = itemOffset + nbPages
  
  currentItems = useMemo(() => {
    return salaries?.slice(itemOffset, endOffset)
  }, [salaries, endOffset, itemOffset])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Col xxl={12}>
        <Card>
          <Card.Body>
            <h4 className="card-title mt-3">Salaires</h4>
            
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
                  <i className='bi bi-plus'/> Paiement
                </Button>
              </Col>
            </Row>
            
            <div>
              <Table responsive striped>
                <thead className='bg-primary'>
                <tr>
                  {salaryItems.length > 0 && salaryItems.map(t =>
                    <th key={t.label} className='align-middle text-white'>{t.label}</th>)}
                  <th className='align-middle'/>
                </tr>
                </thead>
                
                <tbody>
                {currentItems && currentItems?.length > 0 && currentItems?.map(m =>
                  <AgentSalaryItem key={m.id} data={m}/>)}
                </tbody>
              </Table>
              
              <div className='mt-3 px-3 pe-3'>
                <SimplePagination
                  items={salaries}
                  setItemOffset={setItemOffset}
                  itemsPerPage={nbPages}/>
              </div>
            </div>
            
            {loader && <FadeSpinLoader loading={loader}/>}
          </Card.Body>
        </Card>
      </Col>
      
      {agent && <AddSalaryModal onRefresh={onRefresh} show={show} onHide={toggleShow} agent={agent}/>}
    </ErrorBoundary>
  )
}
