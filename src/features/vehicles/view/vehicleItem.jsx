import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender} from "../../../components";
import {Link, useNavigate} from "react-router-dom";
import {entrypoint} from "../../../app/store";
import {Dropdown} from "react-bootstrap";
import {agentActionItems} from "../../staff/model/agent.service";
import {useState} from "react";
import {onVehicleActionsFilter} from "../model/vehicle.service";
import VehicleForm from "./vehicleForm";
import avatar2 from "../../../assets/images/avatar/default_profile.jpg";
import {strTotoLimit} from "../../../services";

export default function VehicleItem({data, onRefresh}) {
  const file = data?.certificate ? data.certificate?.contentUrl : null
  const navigate = useNavigate()
  const agent = data?.agent ? {
    id: data.agent.id,
    name: data.agent.name,
    lastName: data.agent?.lastName ? data.agent.lastName : null,
    firstName: data.agent?.firstName ? data.agent.firstName : null,
    profile: data.agent?.profile ? data.agent.profile?.contentUrl : null,
  } : null
  
  const [show, setShow] = useState(false)
  
  const toggleShow = () => setShow(!show)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className='align-middle'>{data?.type && data.type.name.toUpperCase()}</td>
        <th className='align-middle'>
          <Link to={`/app/vehicles/${data.id}/show`}>{data.brand}</Link>
        </th>
        <td className='align-middle'>{data?.numberplate && data.numberplate}</td>
        <td className='align-middle'>
          {file && (
            <>
              <i className='bi bi-cloud-download me-1'/>
              <a href={entrypoint+file} target='_blank' rel='noreferrer'>
                {strTotoLimit(12, 40, file)}
              </a>
            </>
          )}
        </td>
        
        <td className='align-middle'>
          {agent ? (
            <>
              <Link to={`/app/agents/${agent.id}/show`}>
                <img
                  src={agent?.profile ? entrypoint+agent.profile : avatar2}
                  alt=""
                  className="avatar-md avatar rounded-circle me-1"/>
                
                {agent.name+' '}
                {agent?.firstName}
              </Link>
            </>
          ) : '-'}
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
                    onClick={() => onVehicleActionsFilter(f.event, data, navigate, toggleShow)}>
                    {f.title}
                  </Dropdown.Item>)}
              </Dropdown.Menu>
            </>
          }/>
        </td>
      </tr>
      
      <AppOffCanvas
        children={<VehicleForm onHide={toggleShow} data={data} onRefresh={onRefresh}/>}
        title={<><i className='bi bi-plus'/> Modification du véhicule</>}
        show={show}
        onHide={toggleShow}/>
    </ErrorBoundary>
  )
}
