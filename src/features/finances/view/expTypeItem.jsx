import {useState} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender, RemoveModal} from "../../../components";
import {Link} from "react-router-dom";
import {Dropdown} from "react-bootstrap";
import {expTypeItems, onExpTypeActionsFilter} from "../model/finances.service";
import {useDeleteExpTypeMutation} from "../model/exp.type.api.slice";
import toast from "react-hot-toast";
import EditExpTypeForm from "./editExpTypeForm";

export default function ExpTypeItem({data, onPaginate, parentID, page, pages, name, isPaginated, isSearched, onSearchQuery, onRefresh, navigate}) {
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteExpType] = useDeleteExpTypeMutation()
  
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  const onDelete = async () => {
    toggleOpen()
    try {
      await deleteExpType(data)
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">
          {data.name}
        </td>
        <td className="align-middle text-end">
          {parentID && <Link to={`/app/departments/${data.id}/${data?.slug}`}><i className='bi bi-link'/></Link>}
          {!parentID &&
            <Dropdown className='dropstart' children={
              <>
                <Dropdown.Toggle className='bg-white border-0 shadow-none'>
                  <i className='bi bi-three-dots-vertical text-primary'/>
                </Dropdown.Toggle>
                
                <Dropdown.Menu>
                  {expTypeItems.length > 0 && expTypeItems.map((f, i) =>
                    <Dropdown.Item
                      key={i}
                      className={f?.className}
                      onClick={() => onExpTypeActionsFilter(f.event, data, navigate, toggleShow, toggleOpen)}>
                      {f.title}
                    </Dropdown.Item>)}
                </Dropdown.Menu>
              </>
            }/>}
        </td>
      </tr>
      
      <AppOffCanvas
        children={<EditExpTypeForm
          data={data}
          onRefresh={onRefresh}
          onHide={toggleShow}/>}
        title={<><i className='bi bi-pencil-square'/> Modification du type</>}
        show={show}
        onHide={toggleShow}/>
      
      <RemoveModal
        onRefresh={onRefresh}
        show={open}
        data={data}
        onRemove={onDelete}
        message={`ce type de dépenses (${data.name?.toUpperCase()})`}
        onHide={toggleOpen}/>
    </ErrorBoundary>
  )
}
