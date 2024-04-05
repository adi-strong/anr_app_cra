import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import PropTypes from "prop-types";
import {Col, Form, Row, Table} from "react-bootstrap";
import RecoveryItem from "./recoveryItem";
import {useDispatch, useSelector} from "react-redux";
import {useMemo, useState} from "react";
import {onSetNbPages} from "../../config/config.slice";
import {nbPageOptions} from "../../../services";
import SimplePagination from "../../../components/paginations/SimplePagination";

const thItems = [
  {label: 'Agent'},
  {label: 'Date'},
]

const style = {fontSize: '0.7rem'}

export default function RecoveriesList({recoveries=[]}) {
  const dispatch = useDispatch()
  const {nbPages} = useSelector(state => state.config)
  
  const [search, setSearch] = useState('')
  
  let items, currentItems
  items = useMemo(() => {
    let obj = []
    if (recoveries.length > 0) {
      obj = recoveries.map(a => a)
      obj = obj.filter(a =>
        (a.agent.name.toLowerCase().includes(search.toLowerCase())) ||
        (a.agent?.lastName && a.agent.lastName.toLowerCase().includes(search.toLowerCase())) ||
        (a.agent?.firstName && a.agent.firstName.toLowerCase().includes(search.toLowerCase()))
      )
      obj = obj.sort((a, b) => b.id - a.id)
    }
    
    return obj
  }, [recoveries, search])
  
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
            <th className='align-middle p-1 text-uppercase text-center' style={style}>Voir</th>
          </tr>
          </thead>
          
          <tbody>
          {currentItems.length > 0 && currentItems.map(r => <RecoveryItem key={r.id} data={r}/>)}
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

RecoveriesList.propTypes = {
  recoveries: PropTypes.array.isRequired,
}
