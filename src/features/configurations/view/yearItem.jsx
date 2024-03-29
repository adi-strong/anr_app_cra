import {useState} from "react";
import {useDeleteDepartmentMutation} from "../model/department.api.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender, RemoveModal} from "../../../components";
import {Link} from "react-router-dom";
import {Dropdown} from "react-bootstrap";
import {handleRemoveProvince} from "../model/province.service";
import {onYearActionsFilter, yearActionItems} from "../model/year.service";
import EditYearForm from "./editYearForm";

export default function YearItem({data, onPaginate, parentID, page, pages, name, isPaginated, isSearched, onSearchQuery, onRefresh, navigate}) {
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteDepartment] = useDeleteDepartmentMutation()
  
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">
          <Link to={`/app/departments/${data.id}/${data?.slug}`}>{data.name}</Link>
        </td>
        <td className={`align-middle text-${data?.isActive ? 'success' : 'danger'}`}>
          <i className={`bi bi-${data?.isActive ? 'unlock-fill' : 'lock-fill'} me-1`}/>
          {data?.isActive ? 'ACTIVE' : 'INACTIVE'}
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
                  {yearActionItems.length > 0 && yearActionItems.map((f, i) =>
                    <Dropdown.Item
                      key={i}
                      className={f?.className}
                      onClick={() => onYearActionsFilter(f.event, data, navigate, toggleShow, toggleOpen)}>
                      {f.title}
                    </Dropdown.Item>)}
                </Dropdown.Menu>
              </>
            }/>}
        </td>
      </tr>
      
      <AppOffCanvas
        children={<EditYearForm
          data={data}
          onRefresh={onRefresh}
          onHide={toggleShow}/>}
        title={<><i className='bi bi-pencil-square'/> Édition de la session</>}
        show={show}
        onHide={toggleShow}/>
      
      <RemoveModal
        onRefresh={() => {}}
        show={open}
        data={data}
        onRemove={() => handleRemoveProvince(
          data,
          page,
          pages,
          deleteDepartment,
          onSearchQuery,
          onPaginate,
          toggleOpen,
          isPaginated,
          name,
          isSearched
        )}
        message={`ce département (${data.name?.toUpperCase()})`}
        onHide={toggleOpen}/>
    </ErrorBoundary>
  )
}
