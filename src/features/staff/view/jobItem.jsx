import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender, RemoveModal} from "../../../components";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {
  folderTypeActionItems,
  onFolderTypeActionsFilter,
} from "../../configurations/model/folder.type.api.slice";
import {Dropdown} from "react-bootstrap";
import {useDeleteJobMutation} from "../../jobs/model/job.api.service";
import EditJobForm from "./editJobForm";

export default function JobItem({data, pages, onRefresh}) {
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteJob] = useDeleteJobMutation()
  
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  const onDelete = async () => {
    toggleShow()
    await deleteJob({...data, pages})
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle text-uppercase"><Link to={`#!`}>{data.name}</Link></td>
        <td className="align-middle text-uppercase">
          {data?.service ? data.service.name : '-'}
        </td>
        
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
        title={<><i className='bi bi-pencil-square'/> Modification de la fonction</>}
        children={<EditJobForm onRefresh={onRefresh} onHide={toggleShow} data={data}/>}
        show={show}
        onHide={toggleShow}/>
      
      <RemoveModal
        data={data}
        onRemove={onDelete}
        message={`cette fonction (${data.name.toUpperCase()})`}
        show={open}
        onHide={toggleOpen}
        onRefresh={onRefresh}/>
    </ErrorBoundary>
  )
}
