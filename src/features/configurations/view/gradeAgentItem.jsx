import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import avatar2 from "../../../assets/images/avatar/avatar-2.jpg";
import {Link} from "react-router-dom";

export default function GradeAgentItem({data}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">1</td>
        <td className="align-middle">
          <div className="d-flex align-items-center">
            <div>
              <img src={avatar2} alt="" className="avatar-md avatar rounded-circle"/>
            </div>
            <div className="ms-3 lh-1">
              <h5 className=" mb-1">
                <Link to={`/app/agents/${1}/show`} className='text-dark'>Anita Parmar</Link>
              </h5>
              <p className="mb-0">
                adulte / <Link to={`/app/covenants/${1}/show`}>conventioné(e)</Link>
              </p>
            </div>
          </div>
        </td>
        <td className="align-middle">
          Femme
        </td>
        <td className="align-middle">0904651464</td>
        <td className="align-middle">
          <Link to={`/app/services/${1}/show`}>Pédiatrie</Link>
        </td>
        <td className="align-middle text-end">
          <Link to={`/app/agents/${1}/show`}><i className='bi bi-link'/></Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
