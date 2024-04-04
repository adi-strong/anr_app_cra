import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Link} from "react-router-dom";
import avatar2 from "../../../assets/images/avatar/default_profile.jpg";
import {entrypoint} from "../../../app/store";
import moment from "moment";

const style = {fontSize: '0.7rem'}

export default function VehicleAssignmentItem({data}) {
  const agent = {
    id: data.agent.id,
    name: data.agent.name,
    lastName: data.agent?.lastName ? data.agent.lastName : null,
    firstName: data.agent?.firstName ? data.agent.firstName : null,
    profile: data.agent?.profile ? data.agent.profile : null,
    grade: data.agent?.grade ? data.agent.grade : null,
  }
  
  const releasedAt = data?.releasedAt ? data.releasedAt : null
  const startAt = data?.startAt ? data.startAt : null
  const endAt = data?.endAt ? data.endAt : null
  const duration = (startAt && endAt)
    ? moment(endAt).diff(startAt, 'days')
    : null
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle p-1" style={style}>
          <div className="d-flex align-items-center">
            <div>
              <img
                src={agent?.profile ? entrypoint+agent.profile?.contentUrl : avatar2}
                alt=""
                className="avatar-md avatar rounded-circle"/>
            </div>
            <div className="ms-3 lh-1">
              <h5 className=" mb-1">
                <Link to={`/app/agents/${agent.id}/show`} className='text-dark'>
                  {agent.name.toUpperCase()+' '}
                  {agent?.lastName && agent.lastName?.toUpperCase()+' '}
                  <span className='text-capitalize'>{agent?.firstName && agent.firstName}</span>
                </Link>
              </h5>
              {agent?.grade &&
                <p className="mb-0">
                  {agent.grade.name.toUpperCase()+' '}/{' '}
                  <Link to={`/app/grades/${agent.grade.id}/show`}><i className='bi bi-link'/></Link>
                </p>}
            </div>
          </div>
        </td>
        
        <td className={`align-middle p-1 ${duration && duration <= 7 ? 'text-danger' : ''}`} style={style}>
          {duration && duration <= 7 && <i className='bi bi-exclamation-circle-fill'/>}
          {duration && duration+' jour(s)'}
          {!duration && <span className='text-success'>INDÉTERMINÉE</span>}
        </td>
        
        <td className='align-middle p-1' style={style}>{startAt ? moment(startAt).format('ll') : '-'}</td>
        <td className='align-middle p-1' style={style}>{endAt ? moment(endAt).format('ll') : '-'}</td>
        <td className='align-middle p-1' style={style}>{releasedAt ? moment(releasedAt).calendar() : '-'}</td>
      </tr>
    </ErrorBoundary>
  )
}
