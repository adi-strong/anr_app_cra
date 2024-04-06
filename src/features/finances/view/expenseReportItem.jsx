import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Link} from "react-router-dom";

const style = {fontSize: '0.7rem'}

export default function ExpenseReportItem({data}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className='align-middle p-1' style={style}>
          <Link to={`/app/expenses/${data.id}/show`}>{data.object.toUpperCase()}</Link>
        </td>
        <td className='align-middle p-1' style={style}>{data.bearer.toUpperCase()}</td>
        <td className='align-middle p-1' style={style}>{data.rate}</td>
        <td className='align-middle text-end p-1' style={style}>{parseFloat(data.amount1).toFixed(2)}</td>
        <td className='align-middle text-end p-1' style={style}>{parseFloat(data.amount2).toFixed(2)}</td>
      </tr>
    </ErrorBoundary>
  )
}
