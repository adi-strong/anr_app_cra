import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Link} from "react-router-dom";
import {entrypoint} from "../../../app/store";
import avatar2 from "../../../assets/images/avatar/default_profile.jpg";
import moment from "moment/moment";
import {Badge} from "react-bootstrap";

export default function Assignment2Item({data}) {
  const agent = data?.agent ? data.agent : null
  const profile = agent?.profile ? entrypoint+agent.profile?.contentUrl : avatar2
  const duration = !(data?.startAt && data?.endAt)
  
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
                <Link to={`#!`}>
                  {agent.name.toUpperCase()+' '}
                  <span className='text-capitalize'>{agent?.firstName && agent.firstName}</span>
                </Link>
              </h5>
              {agent?.grade &&
                <p className="mb-0">
                  {agent.grade.name.toLowerCase()+' '}/{' '}
                  <Link to={`/app/grades/${agent.grade.id}/show`}><i className='bi bi-link'/></Link>
                </p>}
            </div>
          </div>
        </td>
        <td className="align-middle">
          <i className='bi bi-caret-down-fill text-danger me-1'/>
          {data?.origin && data.origin?.name?.toUpperCase()}
        </td>
        <td className="align-middle">
          <i className='bi bi-caret-right-fill text-success me-1'/>
          {data?.destination && data.destination?.name?.toUpperCase()}
        </td>
        <td className="align-middle">
          {data?.province && data.province?.name?.toUpperCase()}
        </td>
        <th className="align-middle">
          {duration && <small className='text-success'>INDÉTERMINÉE</small>}
          {!duration && moment(data?.endAt).diff(data?.startAt, 'days')+' jour(s)'}
        </th>
        <th className="align-middle">
          <Badge bg={data?.isActive ? 'success' : 'danger'}>{data?.isActive ? 'ACTIF' : 'INACTIF'}</Badge>
        </th>
      </tr>
    </ErrorBoundary>
  )
}
