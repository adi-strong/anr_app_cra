import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import moment from "moment";

const style = {fontSize: '0.7rem'}

export default function FuelSupplyReportItem({data}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      {data &&
        <tr>
          <td className='align-middle text-primary p-1' style={{ fontSize: '0.7rem', cursor: 'pointer' }}>{data.id}</td>
          <td className='align-middle p-1' style={style}>
            <span className='fw-bold'><i className='bi bi-caret-up-fill text-success'/> {data.quantity}</span> Litre(s)
          </td>
          <td className='align-middle text-uppercase p-1' style={style}>{data?.fuel}</td>
          <td className='align-middle text-uppercase p-1' style={style}>{data?.site}</td>
          <td className='align-middle text-capitalize p-1' style={style}>
            {data?.createdAt && moment(data.createdAt).format('lll')}
          </td>
        </tr>}
    </ErrorBoundary>
  )
}
