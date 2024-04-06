import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, RemoveModal} from "../../../components";
import {Link} from "react-router-dom";
import {useState} from "react";
import {Dropdown} from "react-bootstrap";
import {actionItems} from "../../../services";
import {handleRemoveProvince} from "../../configurations/model/province.service";
import moment from "moment";
import {useDeleteExpenseMutation} from "../model/expenses.api.slice";
import {onExpenseFilterAction} from "../model/finances.service";
import EditExpenseModal from "./editExpenseModal";

export default function ExpenseItem({data, onPaginate, parentID, page, pages, name, isPaginated, isSearched, onSearchQuery, onRefresh, navigate}) {
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteExpense] = useDeleteExpenseMutation()
  
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">
          <Link to={`/app/expenses/${data.id}/show`}>{data.object}</Link>
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
                      onClick={() => onExpenseFilterAction(f.event, data, navigate, toggleShow, toggleOpen)}>
                      {f.title}
                    </Dropdown.Item>)}
                </Dropdown.Menu>
              </>
            }/>}
        </td>
      </tr>
      
      <EditExpenseModal
        data={data}
        onRefresh={onRefresh}
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
          deleteExpense,
          onSearchQuery,
          onPaginate,
          toggleOpen,
          isPaginated,
          name,
          isSearched
        )}
        message={`cette dépense (${data.object?.toUpperCase()})`}
        onHide={toggleOpen}/>
    </ErrorBoundary>
  )
}
