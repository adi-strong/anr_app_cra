import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import moment from "moment";
import {Link} from "react-router-dom";

const date = new Date()

export default function MissionItem({mission}) {
  const startAt = mission?.startAt ? mission.startAt : null
  const endAt = mission?.endAt ? mission.endAt : null
  const duration = (startAt && endAt) ? moment(endAt).diff(date, 'days') : null
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <th className='align-middle'>{mission.object}</th>
        <td className='align-middle'>{mission?.place}</td>
        <td className={duration && duration <= 7 ? 'text-danger' : ''}>
          {duration && duration <= 7 ? <i className='bi bi-exclamation-circle-fill me-1'/> : ''}
          {duration ? duration+' jour(s)' : '-'}
        </td>
        
        <td className='align-middle text-end'>
          <Link to={`/app/missions/${mission.id}/show`}><i className='bi bi-link'/></Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
