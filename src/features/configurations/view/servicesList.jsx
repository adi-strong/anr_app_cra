import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender} from "../../../components";
import PropTypes from "prop-types";
import {Button, Card, Col, Form, Row, Table} from "react-bootstrap";
import {useMemo, useState} from "react";
import AddServicesForm from "./addServicesForm";
import {data} from "../../dashboard/view/sections/FinanceSection";
import {useSelector} from "react-redux";
import SimplePagination from "../../../components/paginations/SimplePagination";
import {serviceItems} from "../model/department.service";
import ServiceItem from "./serviceItem";
import {useNavigate} from "react-router-dom";

export default function ServicesList({services = [], onRefresh, department}) {
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)
  
  const {nbPages} = useSelector(state => state.config)
  
  const toggleShow = () => setShow(!show)
  
  const navigate = useNavigate()
  let sItems, currentItems
  const [itemOffset, setItemOffset] = useState(0)
  
  const endOffset = itemOffset + nbPages
  
  sItems = useMemo(() => {
    let obj = []
    if (services.length > 0) obj = services.filter(s =>
      s?.name?.toLowerCase().includes(search.toLowerCase())
    )
    
    return obj
  }, [services, search])
  
  currentItems = useMemo(() => {
    return sItems?.slice(itemOffset, endOffset)
  }, [sItems, endOffset, itemOffset])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Card className='mt-5'>
        <Card.Header className='bg-white pt-5'>
          <Card.Title>Liste de services</Card.Title>
          
          <Row>
            <Col md={8} className='mb-3'>
              <Button onClick={toggleShow}>
                Ajouter <i className='bi bi-chevron-double-right'/>
              </Button>
            </Col>
            
            <Col md={4} className='mb-3'>
              <Form.Control
                disabled={false}
                autoComplete='off'
                placeholder='Recherche'
                name='search'
                value={search}
                onChange={({target}) => setSearch(target.value)}/>
            </Col>
          </Row>
        </Card.Header>
        
        <div>
          <Table className='text-nowrap'>
            <thead className='table-light'>
            <tr>
              {serviceItems.map(t =>
                <th key={t.label} className='align-middle'>
                  {t.label}
                </th>)}
              <th className='text-end text-primary'/>
            </tr>
            </thead>
            
            <tbody>
            {currentItems?.length > 0 && currentItems?.map(s =>
              <ServiceItem
                key={s.id}
                data={s}
                onRefresh={onRefresh}
                navigate={navigate}/>)}
            </tbody>
          </Table>
        </div>
        
        <div className='mt-3 px-3 pe-3'>
          <SimplePagination
            items={sItems}
            setItemOffset={setItemOffset}
            itemsPerPage={nbPages}/>
        </div>
      </Card>
      
      <AppOffCanvas
        title={<><i className='bi bi-plus'/> Ajout de services</>}
        children={<AddServicesForm onHide={toggleShow} data={data} onRefresh={onRefresh} department={department}/>}
        show={show}
        onHide={toggleShow}/>
    </ErrorBoundary>
  )
}

ServicesList.propTypes = {
  services: PropTypes.array,
}
