import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {entrypoint} from "../../../app/store";
import moment from "moment";

export default function FolderItem({data}) {
  const type = data?.type ? data.type?.name : null
  const file = data?.docObject ? entrypoint+data.docObject?.contentUrl : null
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className='align-middle'>{type && type?.toUpperCase()}</td>
        <td className='align-middle'>
          {file && <a href={file} target='_blank' rel='noreferrer'>
            {data?.docObject?.contentUrl?.substring(12)}
          </a>} <i className='bi bi-cloud-download mx-1'/>
        </td>
        <td className='align-middle' colSpan={2}>{data?.releasedAt && moment(data.releasedAt).calendar()}</td>
      </tr>
    </ErrorBoundary>
  )
}
