import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, RemoveModal} from "../../../components";
import {Link, useNavigate} from "react-router-dom";
import avatar2 from "../../../assets/images/avatar/default_profile.jpg";
import {entrypoint} from "../../../app/store";
import {sexLabel, stateColor, stateLabel} from "../../../services";
import {Badge, Dropdown} from "react-bootstrap";
import {agentActionItems, onAgentActionsFilter} from "../model/agent.service";
import {useState} from "react";
import {useDeleteAgentMutation} from "../model/agent.api.slice";

export default function AgentItem({data, pages, onRefresh}) {
  const profile = data?.profile ? entrypoint+data.profile?.contentUrl : avatar2
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [deleteAgent] = useDeleteAgentMutation()
  
  const toggleShow = () => setShow(!show)
  
  const onDelete = async () => {
    toggleShow()
    await deleteAgent({...data, pages})
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">
          <div className="d-flex align-items-center">
            <div>
              <img src={profile} alt="" className="avatar-md avatar rounded-circle"/>
            </div>
            <div className="ms-3 lh-1">
              <h5 className=" mb-1">
                <Link to={`/app/agents/${data.id}/show`} className='text-dark'>
                  {data.name.toUpperCase()+' '}
                  {data?.lastName && data.lastName?.toUpperCase()+' '}
                  <span className='text-capitalize'>{data?.firstName && data.firstName}</span>
                </Link>
              </h5>
              {data?.grade &&
                <p className="mb-0">
                  {data.grade.name.toLowerCase()+' '}/{' '}
                  <Link to={`/app/grades/${data.grade.id}/show`}><i className='bi bi-link'/></Link>
                </p>}
            </div>
          </div>
        </td>
        <td className="align-middle">
          {data?.sex ? sexLabel[data.sex] : '-'}
        </td>
        <td className="align-middle">{data.phone}</td>
        <td className="align-middle text-uppercase">
          {data?.service
            ? <Link to={`/app/services/${data.service.id}/${data.service?.slug}`}>{data.service.name}</Link>
            : '-'}
        </td>
        <td className="align-middle text-uppercase">
          {data?.state && <Badge bg={stateColor[data.state]}>{stateLabel[data.state]}</Badge>}
        </td>
        <td className="align-middle text-end">
          <Dropdown className='dropstart' children={
            <>
              <Dropdown.Toggle className='bg-white border-0 shadow-none'>
                <i className='bi bi-three-dots-vertical text-primary'/>
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                {agentActionItems.length > 0 && agentActionItems.map((f, i) =>
                  <Dropdown.Item
                    key={i}
                    className={f?.className}
                    onClick={() => onAgentActionsFilter(f.event, data, navigate, toggleShow)}>
                    {f.title}
                  </Dropdown.Item>)}
              </Dropdown.Menu>
            </>
          }/>
        </td>
      </tr>
      
      <RemoveModal
        data={data}
        onRemove={() => onDelete()}
        message={`cet agent (${data.name.toUpperCase()})`}
        show={show}
        onHide={toggleShow}
        onRefresh={onRefresh}/>
    </ErrorBoundary>
  )
}
