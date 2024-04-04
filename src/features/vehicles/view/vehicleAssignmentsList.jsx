import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import PropTypes from "prop-types";
import {Col, Form, Row, Table} from "react-bootstrap";
import VehicleAssignmentItem from "./vehicleAssignmentItem";
import {useDispatch, useSelector} from "react-redux";
import {useMemo, useState} from "react";
import SimplePagination from "../../../components/paginations/SimplePagination";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";

const thItems = [
  {label: 'Agent'},
  {label: 'Durée'},
  {label: 'Date de début'},
  {label: 'Date de fin'},
  {label: 'Date de Publication'},
]

const style = {fontSize: '0.7rem'}

export default function VehicleAssignmentsList({assignments=[]}) {
  const dispatch = useDispatch()
  const {nbPages} = useSelector(state => state.config)
  
  const [search, setSearch] = useState('')
  
  let items, currentItems
  items = useMemo(() => {
    let obj = []
    if (assignments.length > 0) {
      obj = assignments.map(a => a)
      obj = obj.filter(a =>
        (a.agent.name.toLowerCase().includes(search.toLowerCase())) ||
        (a.agent?.lastName && a.agent.lastName.toLowerCase().includes(search.toLowerCase())) ||
        (a.agent?.firstName && a.agent.firstName.toLowerCase().includes(search.toLowerCase()))
      )
      obj = obj.sort((a, b) => b.id - a.id)
    }
    
    return obj
  }, [assignments, search])
  
  const [itemOffset, setItemOffset] = useState(0)
  
  const endOffset = itemOffset + nbPages
  
  currentItems = useMemo(() => {
    return items?.slice(itemOffset, endOffset)
  }, [items, endOffset, itemOffset])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Row className='mb-3'>
        <Col md={5} className='mb-2'>
          <div className='me-2' style={{ width: 150 }}>
            <Form.Select
              value={nbPages}
              onChange={({target}) => dispatch(onSetNbPages(target.value))}>
              {nbPageOptions.map(o =>
                <option key={o.value} value={o.value}>{o.label}</option>)}
            </Form.Select>
          </div>
        </Col>
        
        <Col md={7} className='mb-2'>
          <Form.Control
            value={search}
            onChange={({target}) => setSearch(target.value)}
            placeholder='Rechercher...'/>
        </Col>
      </Row>
      
      <div>
        <Table className='text-nowrap' bordered>
          <thead className='table-light fw-bold'>
          <tr>
            {thItems.length > 0 && thItems.map(t =>
              <th key={t.label} className='align-middle p-1 text-uppercase' style={style}>{t.label}</th>)}
          </tr>
          </thead>
          
          <tbody>
          {currentItems.length > 0 && currentItems.map(a =>
            <VehicleAssignmentItem key={a.id} data={a}/>)}
          </tbody>
        </Table>
      </div>
      
      <div className='mt-3 px-3 pe-3'>
        <SimplePagination
          items={items}
          setItemOffset={setItemOffset}
          itemsPerPage={nbPages}/>
      </div>
    </ErrorBoundary>
  )
}

VehicleAssignmentsList.propTypes = {
  assignments: PropTypes.array.isRequired,
}
