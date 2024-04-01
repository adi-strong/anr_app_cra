import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import moment from "moment";
import {Link} from "react-router-dom";

export default function MissionItem({mission}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <th className='align-middle'>{mission.object}</th>
        <td className='align-middle'>{mission?.place}</td>
        <td>
          {mission?.startAt && mission?.endAt && (
            <>
              {moment(mission.endAt).diff(mission.startAt, 'days')} jour(s)
            </>
          )}
        </td>
        
        <td className='align-middle text-end'>
          <Link to={`#!`}><i className='bi bi-link'/></Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
