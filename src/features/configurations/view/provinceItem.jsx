import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender, RemoveModal} from "../../../components";
import {Link} from "react-router-dom";
import {Dropdown} from "react-bootstrap";
import {actionItems} from "../../../services";
import {useState} from "react";
import {handleRemoveProvince, onProvinceActionsFilter} from "../model/province.service";
import EditProvinceForm from "./editProvinceForm";
import {useDeleteProvinceMutation} from "../model/province.api.slice";

export default function ProvinceItem({data, page, isSearched, name, pages, isPaginated, navigate, onSearchQuery, onPaginate, onRefresh}) {
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteProvince] = useDeleteProvinceMutation()
  
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">
          <Link to={`/app/provinces/${data.id}/${data?.slug}`}>{data.name}</Link>
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
                    onClick={() => onProvinceActionsFilter(f.event, data, navigate, toggleShow, toggleOpen)}>
                    {f.title}
                  </Dropdown.Item>)}
              </Dropdown.Menu>
            </>
          }/>
        </td>
      </tr>
      
      <AppOffCanvas
        children={<EditProvinceForm
          data={data}
          onRefresh={onRefresh}
          onHide={toggleShow}/>}
        title={<><i className='bi bi-pencil-square'/> Modification de la province</>}
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
          deleteProvince,
          onSearchQuery,
          onPaginate,
          toggleOpen,
          isPaginated,
          name,
          isSearched
        )}
        message={`cette province (${data.name?.toUpperCase()})`}
        onHide={toggleOpen}/>
    </ErrorBoundary>
  )
}
