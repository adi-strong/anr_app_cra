import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import moment from "moment";
import {Link} from "react-router-dom";

export default function AssignmentItem({data}) {
  const duration = !(data?.startAt && data?.endAt)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className='align-middle'>
          <i className='bi bi-caret-down-fill text-danger me-1'/>
          {data?.origin && data.origin?.name?.toUpperCase()}
        </td>
        <td className='align-middle'>
          <i className='bi bi-caret-right-fill text-success me-1'/>
          {data?.destination && data.destination?.name?.toUpperCase()}
        </td>
        <td className='align-middle'>
          {duration && <small className='text-success'>INDÉTERMINÉE</small>}
          {!duration && (
            <>
              {data?.startAt && <>du {moment(data.startAt).format('ll')} au </>}
              {data?.endAt ? moment(data.endAt).format('ll') : '-'}
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
