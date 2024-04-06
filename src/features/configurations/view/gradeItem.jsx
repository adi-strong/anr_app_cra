import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Link} from "react-router-dom";

export default function GradeItem({data, navigate, onRefresh}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle text-uppercase">
          <Link to={`/app/grades/${data.id}/${data?.slug}`}>{data.name}</Link>
        </td>
        <td className="align-middle text-end">
          <Link to={`/app/grades/${data.id}/${data?.slug}`}><i className='bi bi-link'/></Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
