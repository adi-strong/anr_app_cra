import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Link} from "react-router-dom";

export default function ServiceItem({data}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">
          <Link to={`/app/services/${1}/show`}>Nom du service</Link>
        </td>
        <td className="align-middle">0</td>
        <td className="align-middle">nom-du-departement</td>
        <td className="align-middle text-end">
          <Link to={`/app/services/${1}/show`}><i className='bi bi-link'/></Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
