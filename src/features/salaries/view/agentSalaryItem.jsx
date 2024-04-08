import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";

export default function AgentSalaryItem({data}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <th className='align-middle'>
          {data?.currency && data.currency?.image &&
            <img src={data.currency.image} width={30} height={20} className='me-1' alt=''/>}
          {data.baseAmount}
        </th>
        <td className='align-middle'>{data?.riskPremiumAmount ? data.riskPremiumAmount : '-'}</td>
        <td className='align-middle'>{data?.functionBonusAmount ? data.functionBonusAmount : '-'}</td>
        <th className='align-middle' colSpan={2}>
          {data?.total && data.total+' '  }
          {data?.currency && data.currency?.symbol}
        </th>
      </tr>
    </ErrorBoundary>
  )
}
