import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import moment from "moment/moment";

const style = {fontSize: '0.7rem'}

export default function FuelConsumeReportItem({data}) {
  const agent = data?.agent ? {
    name: data.agent.name,
    lastName: data.agent?.lastName,
    firstName: data.agent?.firstName,
  } : null
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      {data &&
        <tr>
          <td className='align-middle p-1' style={style}>
            <span className='fw-bold'><i className='bi bi-caret-down-fill text-danger'/> {data.quantity}</span> Litre(s)
          </td>
          <td className='align-middle text-uppercase p-1' style={style}>{data?.fuel}</td>
          <td className='align-middle text-uppercase p-1' style={style}>{data?.site}</td>
          <td className='align-middle text-uppercase p-1' style={style}>{data?.vehicle}</td>
          
          <td className='align-middle text-uppercase p-1' style={style}>
            {agent && (
              <>
                {agent.name+' '}
                {agent?.lastName+' '}
                {agent?.firstName}
              </>
            )}
          </td>
          <td className='align-middle text-uppercase p-1' style={style}>{data?.grade ? data.grade : '-'}</td>
          <td className='align-middle text-capitalize p-1' style={style}>
            {data?.createdAt && moment(data.createdAt).format('lll')}
          </td>
        </tr>}
    </ErrorBoundary>
  )
}
