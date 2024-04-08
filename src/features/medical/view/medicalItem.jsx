import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {entrypoint} from "../../../app/store";
import moment from "moment";
import {Link} from "react-router-dom";

export default function MedicalItem({data}) {
  const file = data?.docObject ? data.docObject?.contentUrl : null
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className='align-middle'>
          <i className='bi bi-cloud-download me-1'/>
          {file && <a href={entrypoint+file} target='_blank' rel='noreferrer'>{file?.substring(12)}</a>}
        </td>
        <td className='align-middle'>
          {data?.releasedAt && moment(data.releasedAt).calendar()}
        </td>
        <td className='align-middle text-end'>
          <Link to={`/app/medical-file/${data?.id}/show`}><i className='bi bi-link'/></Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
