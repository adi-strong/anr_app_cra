import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender, RemoveModal} from "../../../components";
import {Link} from "react-router-dom";
import {useState} from "react";
import {useDeleteServiceMutation} from "../model/department.api.slice";
import {Dropdown} from "react-bootstrap";
import {actionItems} from "../../../services";
import {onServActionsFilter} from "../model/department.service";
import EditServiceForm from "./editServiceForm";
import toast from "react-hot-toast";

export default function ServiceItem({data, navigate, onRefresh}) {const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteService] = useDeleteServiceMutation()
  
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  const onDeleteService = async (data, onRefresh, onHide): void => {
    onHide()
    try {
      await deleteService(data)
      onRefresh()
    }
    catch (e) { toast.error('Problème de connexion.') }
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle text-uppercase">
          <Link to={`/app/services/${data.id}/${data?.slug}`}>{data.name}</Link>
        </td>
        <td className="align-middle">{data?.slug ? data.slug : '-'}</td>
        <td className="align-middle text-end">
          <Dropdown className='dropstart' children={
            <>
              <Dropdown.Toggle className='bg-white border-0 shadow-none'>
                <i className='bi bi-three-dots-vertical text-primary'/>
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                {actionItems.length > 0 && actionItems.map((f, i) =>
                  <Dropdown.Item
                    key={i}
                    className={f?.className}
                    onClick={() => onServActionsFilter(f.event, data, navigate, toggleShow, toggleOpen)}>
                    {f.title}
                  </Dropdown.Item>)}
              </Dropdown.Menu>
            </>
          }/>
        </td>
      </tr>
      
      <AppOffCanvas
        children={<EditServiceForm
          data={data}
          onRefresh={onRefresh}
          onHide={toggleShow}/>}
        title={<><i className='bi bi-pencil-square'/> Modification du service</>}
        show={show}
        onHide={toggleShow}/>
      
      <RemoveModal
        onRefresh={onRefresh}
        show={open}
        data={data}
        onRemove={() => onDeleteService(data, onRefresh, toggleOpen)}
        message={`ce service (${data.name?.toUpperCase()})`}
        onHide={toggleOpen}/>
    </ErrorBoundary>
  )
}
