import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Badge, Dropdown} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {agentActionItems} from "../../staff/model/agent.service";
import {onPropertyActionsFilter} from "../model/property.service";

export default function PropertyItem({data}) {
  const navigate = useNavigate()
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className='align-middle text-uppercase'>
          {data?.type 
            ? <Link to={`/app/properties/${data.id}/show`} className='fw-bold'>{data.type.name}</Link>
            : '-'}
        </td>
        <td className='align-middle text-uppercase'>{data?.province ? data.province.name : '-'}</td>
        <td className='align-middle text-uppercase'>{data?.surface ? data.surface : '-'}</td>
        <td className='align-middle text-uppercase'>{data?.pieces ? data.pieces : '-'}</td>
        <td className='align-middle text-uppercase'>
          <Badge bg={data?.isAvailable ? 'success' : 'danger'}>{data?.isAvailable ? 'Disponible' : 'Occupée'}</Badge>
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
                    onClick={() => onPropertyActionsFilter(f.event, data, navigate)}>
                    {f.title}
                  </Dropdown.Item>)}
              </Dropdown.Menu>
            </>
          }/>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
