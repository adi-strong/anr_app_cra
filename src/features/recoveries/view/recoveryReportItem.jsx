import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import moment from "moment";
import {Link} from "react-router-dom";

const style = {fontSize: '0.7rem'}

export default function RecoveryReportItem({data}) {
  const agent = data?.agent ? {
    name: data.agent.name,
    lastName: data.agent?.lastName,
    firstName: data.agent?.firstName,
  } : null
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className='align-middle p-1 text-uppercase' style={style}>{data?.activity ? data.activity : '-'}</td>
        <td className='align-middle p-1 text-uppercase' style={style}>{data?.province ? data.province : '-'}</td>
        
        <td className='align-middle p-1 text-uppercase' style={style}>
          {data?.society ? (
            <Link to={`/app/societies/${data.society.id}/show`}>
              {data.society.name}
            </Link>
          ) : '-'}
        </td>
        
        <td className='align-middle p-1 text-uppercase' style={style}>
          {agent && (
            <>
              {agent.name+' '}
              {agent?.lastName+' '}
              {agent?.firstName}
            </>
          )}
        </td>
        
        <td className='align-middle p-1' style={style}>
          {data?.releasedAt ? (
            <Link to={`/app/societies/recovery/${data.id}/show`}>
              {moment(data.releasedAt).calendar()}
            </Link>
          ) : '-'}
        </td>
      </tr>
    </ErrorBoundary>
  )
}
