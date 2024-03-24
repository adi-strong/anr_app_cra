import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Link} from "react-router-dom";

export default function CovenantContractItem({data}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">23 Mars 2024</td>
        <td className="align-middle">
          30 Novembre 2024
        </td>
        <td className="align-middle">
          15 Jour(s)
        </td>
        <td className="align-middle">
          -
        </td>
        <td className="align-middle text-end">
          <Link to={`/app/consultations/${1}/show`}><i className='bi bi-link'/></Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
