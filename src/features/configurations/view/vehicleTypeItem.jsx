import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender, RemoveModal} from "../../../components";
import {Dropdown} from "react-bootstrap";
import {folderTypeActionItems, onFolderTypeActionsFilter} from "../model/folder.type.api.slice";
import {useDeleteVehicleTypeMutation} from "../../vehicles/model/vehicle.type.api.slice";
import EditVehicleTypeForm from "./editVehicleTypeForm";

export default function VehicleTypeItem({data, pages, onRefresh}) {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteVehicleType] = useDeleteVehicleTypeMutation()
  
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  const onDelete = async () => {
    toggleOpen()
    await deleteVehicleType({...data, pages})
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className='align-middle text-uppercase'>{data.name}</td>
        
        <td className="align-middle text-end">
          <Dropdown className='dropstart' children={
            <>
              <Dropdown.Toggle className='bg-white border-0 shadow-none'>
                <i className='bi bi-three-dots-vertical text-primary'/>
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                {folderTypeActionItems.length > 0 && folderTypeActionItems.map((f, i) =>
                  <Dropdown.Item
                    key={i}
                    className={f?.className}
                    onClick={() => onFolderTypeActionsFilter(f.event, data, navigate, toggleShow, toggleOpen)}>
                    {f.title}
                  </Dropdown.Item>)}
              </Dropdown.Menu>
            </>
          }/>
        </td>
      </tr>
      
      <AppOffCanvas
        title={<><i className='bi bi-pencil-square'/> Modification type d'activités</>}
        children={<EditVehicleTypeForm onRefresh={onRefresh} onHide={toggleShow} data={data}/>}
        show={show}
        onHide={toggleShow}/>
      
      <RemoveModal
        data={data}
        onRemove={onDelete}
        message={`ce type de véhicule (${data.name.toUpperCase()})`}
        show={open}
        onHide={toggleOpen}
        onRefresh={onRefresh}/>
    </ErrorBoundary>
  )
}
