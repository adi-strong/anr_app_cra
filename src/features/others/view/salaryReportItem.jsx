import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";

const style = {fontSize: '0.7rem'}

// const style2 = {fontSize: '0.7rem'}

export default function SalaryReportItem({data}) {
  const agent = data?.agent ? {
    name: data.agent.name,
    lastName: data.agent?.lastName ? data.agent.lastName : null,
    firstName: data.agent?.firstName ? data.agent.firstName : null,
  } : null
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className='align-middle text-uppercase p-1' style={style}>
          {agent && (
            <>
              {agent.name+' '}
              {agent?.lastName && agent.lastName+' '}
              {agent?.firstName && agent.firstName}
            </>
          )}
        </td>
        
        <td className='align-middle p-1' style={style}>{data?.grade ? data.grade : '-'}</td>
        <td className='align-middle p-1' style={style}>{data?.job ? data.job : '-'}</td>
        <td className='align-middle p-1 text-end' style={style}>
          {data?.baseAmount ? parseFloat(data.baseAmount).toFixed(2)+' ' : '-'}
          {data?.currency && data.currency}
        </td>
        <td className='align-middle p-1 text-end' style={style}>
          {data?.riskPremiumAmount ? parseFloat(data.riskPremiumAmount).toFixed(2)+' ' : '-'}
          {data?.currency && data.currency}
        </td>
        <td className='align-middle p-1 text-end' style={style}>
          {data?.functionBonusAmount ? parseFloat(data.functionBonusAmount).toFixed(2)+' ' : '-'}
          {data?.currency && data.currency}
        </td>
        <td className='align-middle p-1 text-end' style={style}>
          {data?.total ? parseFloat(data.total).toFixed(2)+' ' : '-'}
          {data?.currency && data.currency}
        </td>
      </tr>
    </ErrorBoundary>
  )
}
