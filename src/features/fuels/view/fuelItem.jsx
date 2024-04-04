import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender, RemoveModal} from "../../../components";
import {Link} from "react-router-dom";
import {useState} from "react";
import AddFuelForm from "./addFuelForm";
import {useDeleteFuelMutation} from "../model/fuel.api.slice";

export default function FuelItem({data, onRefresh, site}) {
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteFuel] = useDeleteFuelMutation()
  
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  const onDelete = async () => {
    toggleOpen()
    await deleteFuel(data)
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <div className='mb-3'>
        <Link to={`#!`}>
          <i className='bi bi-fuel-pump me-1'/>
          {data.name?.toUpperCase()}
        </Link>
        : <span className={data.stock <= 100 ? 'text-danger' : 'text-dark'}>
        {data.stock} litre(s)
      </span>
        <i className='bi bi-pencil-square text-dark mx-2 me-2' style={{ cursor: 'pointer' }} onClick={toggleShow}/>
        <i className='bi bi-trash text-danger mx-1' style={{ cursor: 'pointer' }} onClick={toggleOpen}/>
      </div>
      
      <AppOffCanvas
        children={<AddFuelForm onHide={toggleShow} site={site} data={data} onRefresh={onRefresh}/>}
        title={<><i className='bi bi-pencil-square'/> Modification carburant</>}
        show={show}
        onHide={toggleShow}/>
      
      <RemoveModal
        data={data}
        onRemove={onDelete}
        message={`ce carburant (${data?.name?.toUpperCase()})`}
        show={open}
        onHide={toggleOpen}
        onRefresh={onRefresh}/>
    </ErrorBoundary>
  )
}
