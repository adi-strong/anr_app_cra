import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Badge} from "react-bootstrap";
import {subStr} from "../../../services";
import moment from "moment";
import {Link} from "react-router-dom";
import {newsPriorityColor, newsPriorityLabel} from "../../news/services/news.conf.service";

export default function NewsTreatmentItem({data}) {
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <tr className={`text-decoration-${data?.isTreated ? 'line-through' : 'none'}line-through`}>
        <td className='align-middle'>
          <Badge bg={newsPriorityColor[data.priority]}>
            {newsPriorityLabel[data.priority]}
          </Badge>
        </td>
        <td className='align-middle'>
          <Link to={`/app/news/${data?.id}/show`}>
            {data?.title ? subStr(30, data?.title) : 'Aucun titre'}
          </Link>
        </td>
        <td className='align-middle'>
          {data?.releasedAt ? moment(data?.releasedAt).calendar() : '-'}
        </td>
        <td className="align-middle text-end">
          <Link to={`/app/news/${data.id}/show`}>
            <i className='bi bi-link' />
          </Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
