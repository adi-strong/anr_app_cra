import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender, RemoveModal} from "../../../components";
import {Button, Card, Col, Row} from "react-bootstrap";
import {useState} from "react";
import AddFuelStockForm from "./addFuelStockForm";
import {useDeleteFuelSiteMutation} from "../model/fuel.site.api.service";
import AddFuelForm from "./addFuelForm";
import FuelItem from "./fuelItem";

export default function FuelStockItem({data, isFetching, onRefresh, pages}) {
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteFuelSite, {isLoading}] = useDeleteFuelSiteMutation()
  
  const [showFuel, setShowFuel] = useState(false)
  
  const toggleShowFuel = () => setShowFuel(!showFuel)
  
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  const onDelete = async () => {
    toggleOpen()
    await deleteFuelSite({...data, pages})
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Row className='mt-5'>
        <Col md={7} className='mb-2'>
          <h2 className='card-title text-uppercase'>{data.name}</h2>
          <Card.Title><i className='bi bi-map'/> Adresse</Card.Title>
          <p>{data.address}</p>
          
          <Button disabled={isFetching || isLoading} size='sm' onClick={toggleShow} className='me-1'>
            <i className='bi bi-pencil-square'/>
          </Button>
          
          <Button disabled={isFetching || isLoading} size='sm' variant='danger' onClick={toggleOpen} className='me-1'>
            <i className='bi bi-trash'/>
          </Button>
        </Col>
        
        <Col md={5} className='mb-2'>
          <h3 className='card-title mb-3'>
            Stock <i className='bi bi-plus-square-fill' onClick={toggleShowFuel} style={{ cursor: 'pointer' }}/>
          </h3>
          
          {data?.fuels && data.fuels?.length > 0 && data?.fuels.map(f => (f?.isDeleted === false) &&
            <FuelItem key={f.id} data={f} site={data} onRefresh={onRefresh}/>)}
        </Col>
      </Row> <hr/>
      
      <AppOffCanvas
        children={<AddFuelStockForm onHide={toggleShow} data={data} onRefresh={onRefresh}/>}
        title={<><i className='bi bi-pencil-square'/> Modification du site</>}
        show={show}
        onHide={toggleShow}/>
      
      <RemoveModal
        data={data}
        onRemove={onDelete}
        message={`Ce site (${data.name?.toUpperCase()})`}
        show={open}
        onHide={toggleOpen}
        onRefresh={onRefresh}/>
      
      <AppOffCanvas
        children={<AddFuelForm onHide={toggleShowFuel} site={data} onRefresh={onRefresh}/>}
        title={<><i className='bi bi-pencil-square'/> Enregistrement carburant</>}
        show={showFuel}
        onHide={toggleShowFuel}/>
    </ErrorBoundary>
  )
}
