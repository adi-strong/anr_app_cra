import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {entrypoint} from "../../../app/store";
import avatar2 from "../../../assets/images/avatar/default_profile.jpg";
import {Link} from "react-router-dom";
import moment from "moment";

const style = {fontSize: '0.7rem'}

export default function RecoveryItem({data}) {
  const agent = data?.agent
    ? {
      name: data.agent.name,
      lastName: data.agent?.lastName ? data.agent.lastName : null,
      firstName: data.agent?.firstName ? data.agent.firstName : null,
      profile: data.agent?.profile ? data.agent.profile : null,
      grade: data.agent?.grade ? data.agent.grade : null,
    }
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
        
        <td className="align-middle p-1" style={style}>
          {data?.releasedAt ? moment(data.releasedAt).calendar() : '-'}
        </td>
        
        <td className="align-middle text-center p-1" style={style}>
          <Link to={`/app/societies/recovery/${data.id}/show`}><i className='bi bi-eye'/></Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
