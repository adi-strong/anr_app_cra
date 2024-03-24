import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Link} from "react-router-dom";

export default function ExpenseCategoryItem({data}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">
          <Link to={`/app/expense-categories/${1}/show`}>Achat marchandises</Link>
        </td>
        <td className="align-middle">
          OUI
        </td>
        <th className="align-middle">
          2
        </th>
        <td className="align-middle">3 May, 2023</td>
        <td className="align-middle text-end">
          <Link to={`/app/expense-categories/${1}/show`}><i className='bi bi-link'/></Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
