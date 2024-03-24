import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Link} from "react-router-dom";

export default function ExpenseItem({data}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">
          <Link to={`/app/expenses/${1}/show`}>Achat produits pharmaceutiques</Link>
        </td>
        <td className="align-middle">
          <Link to={`/app/expenses/${1}/show`}>Adivin Lifwa</Link>
        </td>
        <th className="align-middle">
          FC 15 000
        </th>
        <td className="align-middle">3 May, 2023</td>
        <td className="align-middle text-end">
          <Link to={`/app/expenses/${1}/show`}><i className='bi bi-link'/></Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
