import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {entrypoint} from "../../../app/store";
import moment from "moment";
import {Link} from "react-router-dom";

export default function FolderItem({data}) {
  const type = data?.type ? data.type?.name : null
  const file = data?.docObject ? entrypoint+data.docObject?.contentUrl : null
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className='align-middle'>{type && type?.toUpperCase()}</td>
        <td className='align-middle'>
          {file && <a href={file} target='_blank' rel='noreferrer'>
            {data?.docObject?.contentUrl?.substring(12)} <i className='bi bi-cloud-download'/>
          </a>}
        </td>
        <td className='align-middle'>{data?.releasedAt && moment(data.releasedAt).calendar()}</td>
        <td className='align-middle text-end'>
          <Link to={`#!`}><i className='bi bi-link'/></Link>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
