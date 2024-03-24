import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Link} from "react-router-dom";
import avatar2 from "../../../assets/images/avatar/avatar-2.jpg";

export default function InvoiceItem({data}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">
          <div className="d-flex align-items-center">
            <div>
              <img src={avatar2} alt="" className="avatar-md avatar rounded-circle"/>
            </div>
            <div className="ms-3 lh-1">
              <h5 className=" mb-1">Anita Parmar</h5>
              <p className="mb-0">
                adulte / <Link to={`/app/covenants/${1}/show`}>conventioné(e)</Link>
              </p>
            </div>
          </div>
        </td>
        <td className="align-middle fw-bold text-primary">
          FC 9175
        </td>
        <td className="align-middle text-success fw-bold">
          FC 200
        </td>
        <td className="align-middle text-danger fw-bold">
          FC 1876        </td>
        <td className="align-middle">3 May, 2023</td>
        <td className="align-middle text-end">
          <Link to={`/app/invoices/${1}/show`}><i className='bi bi-link'/></Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
