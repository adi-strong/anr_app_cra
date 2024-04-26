import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Button, Card, Col, Form, Row, Table} from "react-bootstrap";
import {FadeSpinLoader} from "../../../loaders";
import {useMemo, useState} from "react";
import {missionItems} from "../model/mission.service";
import AddMissionModal from "./addMissionModal";
import MissionItem from "./missionItem";
import {useDispatch, useSelector} from "react-redux";
import SimplePagination from "../../../components/paginations/SimplePagination";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";

export default function AgentMissions({agent, isError, loader, onRefresh}) {
  const dispatch = useDispatch()
  
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)
  
  const toggleShow = () => setShow(!show)
  
  const {nbPages} = useSelector(state => state.config)
  
  let missions, currentItems
  missions = useMemo(() => {
    let obj = []
    if (!isError && agent && agent?.missions && agent.missions?.length > 0) {
      const missions = agent.missions
      obj = missions.map(m => m)
      obj = obj.filter(m =>
        (m.object.toLowerCase().includes(search.toLowerCase())) ||
        (m.place.toLowerCase().includes(search.toLowerCase())) ||
        (m.transport.toLowerCase().includes(search.toLowerCase())) ||
        (m?.transportName && m.transportName.toLowerCase().includes(search.toLowerCase())) ||
        (m?.ticketNumber && m.ticketNumber.toLowerCase().includes(search.toLowerCase())) ||
        (m?.accommodationAddress && m.accommodationAddress.toLowerCase().includes(search.toLowerCase())) ||
        (m?.startAt && m.startAt.toLowerCase().includes(search.toLowerCase())) ||
        (m?.endAt && m.endAt.toLowerCase().includes(search.toLowerCase())) ||
        (m?.accommodation && m.accommodation.toLowerCase().includes(search.toLowerCase()))
      )
    }
    
    return obj
  }, [isError, agent, search])
  
  const [itemOffset, setItemOffset] = useState(0)
  
  const endOffset = itemOffset + nbPages
  
  currentItems = useMemo(() => {
    return missions?.slice(itemOffset, endOffset)
  }, [missions, endOffset, itemOffset])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Col xxl={12}>
        <Card>
          <Card.Body>
            <h4 className="card-title mt-3">Missions</h4>
            
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
                
                <Form.Control
                  disabled={loader}
                  autoComplete='off'
                  value={search}
                  onChange={({target}) => setSearch(target.value)}
                  placeholder='Recherche...'/>
              </Col>
              
              <Col md={6} className='mb-3 text-md-end'>
                <Button disabled={loader} onClick={toggleShow} variant='outline-primary'>
                  <i className='bi bi-plus'/> Nouvelle mission
                </Button>
              </Col>
            </Row>
            
            <div>
              <Table responsive>
                <thead className='bg-primary'>
                <tr>
                  {missionItems.length > 0 && missionItems.map(t =>
                    <th key={t.label} className='align-middle text-white'>{t.label}</th>)}
                  <th className='align-middle'/>
                </tr>
                </thead>
                
                <tbody>
                {currentItems && currentItems?.length > 0 && currentItems?.map(m =>
                  <MissionItem key={m.id} mission={m}/>)}
                </tbody>
              </Table>
              
              <div className='mt-3 px-3 pe-3'>
                <SimplePagination
                  items={missions}
                  setItemOffset={setItemOffset}
                  itemsPerPage={nbPages}/>
              </div>
            </div>
            
            {loader && <FadeSpinLoader loading={loader}/>}
          </Card.Body>
        </Card>
      </Col>
      
      {agent && <AddMissionModal onRefresh={onRefresh} show={show} onHide={toggleShow} agent={agent}/>}
    </ErrorBoundary>
  )
}
