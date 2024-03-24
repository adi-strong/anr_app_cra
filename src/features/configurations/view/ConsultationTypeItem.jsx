import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Link} from "react-router-dom";

export default function ConsultationTypeItem({data}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">
          <Link to={`/app/consultations/types/${1}/show`}>Nom du type</Link>
        </td>
        <td className="align-middle">
          FC 1982
        </td>
        <td className="align-middle">nom-du-type</td>
        <td className="align-middle text-end">
          <Link to={`/app/nursing/${1}/show`}><i className='bi bi-link'/></Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
