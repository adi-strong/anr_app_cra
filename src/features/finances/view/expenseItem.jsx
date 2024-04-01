import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, RemoveModal} from "../../../components";
import {Link} from "react-router-dom";
import {useState} from "react";
import {useDeleteDepartmentMutation} from "../../configurations/model/department.api.slice";
import {Dropdown} from "react-bootstrap";
import {actionItems} from "../../../services";
import {onDepActionsFilter} from "../../configurations/model/department.service";
import {handleRemoveProvince} from "../../configurations/model/province.service";
import moment from "moment";

export default function ExpenseItem({data, onPaginate, parentID, page, pages, name, isPaginated, isSearched, onSearchQuery, onRefresh, navigate}) {
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteDepartment] = useDeleteDepartmentMutation()
  
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">
          <Link to={`/app/departments/${data.id}/${data?.slug}`}>{data.object}</Link>
        </td>
        <td className="align-middle">
          {data.bearer}
        </td>
        <td className="align-middle">{data.total}</td>
        <td className="align-middle">{data?.releasedAt && moment(data.releasedAt).format('ll')}</td>
        <td className="align-middle text-end">
          {parentID && <Link to={`/app/departments/${data.id}/${data?.slug}`}><i className='bi bi-link'/></Link>}
          {!parentID &&
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
                      onClick={() => onDepActionsFilter(f.event, data, navigate, toggleShow, toggleOpen)}>
                      {f.title}
                    </Dropdown.Item>)}
                </Dropdown.Menu>
              </>
            }/>}
        </td>
      </tr>
      
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
