import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";

const nStyle = {
  fontWeight: 800,
  color: '#0909b0'
}
const uStyle2 = { borderBottom: '2px solid #0909b0' }

export default function ShowInvoiceHeader({title}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <div className='mt-5 pt-1 px-10 pe-10 mb-3' style={uStyle2}>
        <h3 style={nStyle} className='text-center'>{title}</h3>
      </div>
    </ErrorBoundary>
  )
}
