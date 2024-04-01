import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender} from "../../../components";
import {Link, useNavigate} from "react-router-dom";
import {entrypoint} from "../../../app/store";
import {Dropdown} from "react-bootstrap";
import {agentActionItems} from "../../staff/model/agent.service";
import {useState} from "react";
import {onVehicleActionsFilter} from "../model/vehicle.service";
import VehicleForm from "./vehicleForm";

export default function VehicleItem({data, onRefresh}) {
  const file = data?.certificate ? data.certificate?.contentUrl : null
  const navigate = useNavigate()
  
  const [show, setShow] = useState(false)
  
  const toggleShow = () => setShow(!show)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className='align-middle'>{data?.type && data.type.name.toUpperCase()}</td>
        <th className='align-middle'>
          <Link to={`#!`}>{data.brand}</Link>
        </th>
        <td className='align-middle'>{data?.numberplate && data.numberplate}</td>
        <td className='align-middle'>
          {file && (
            <>
              <i className='bi bi-cloud-download me-1'/>
              <a href={entrypoint+file} target='_blank' rel='noreferrer'>
                {file.substring(12)}
              </a>
            </>
          )}
        </td>
        
        <td className='align-middle'>{data?.numberplate && data.numberplate}</td>
        
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
