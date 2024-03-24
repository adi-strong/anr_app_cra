import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Table} from "react-bootstrap";
import PropTypes from "prop-types";
import ConsultationFileHeader from "./consultationFileHeader";

const nStyle = {
  fontWeight: 800,
  color: '#0909b0'
}

const uStyle4 = { borderBottom: '1px dotted #0909b0' }

export default function ConsultationFile({ printRef, loader, data }) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <div className='container-fluid' ref={printRef}>
        {/* HEADER ******************************************************************* */}
        <ConsultationFileHeader/>
        {/* END HEADER *************************************************************** */}
        
        
        {/* BODY ********************************************************************** */}
        <div className='px-8 pe-8 pt-5'>
          <Table borderless>
            <thead>
            <tr>
              <th style={nStyle}>DATE</th>
              <th style={nStyle}>- OBSERVATIONS</th>
            </tr>
            </thead>
            
            <tbody>
            <tr>
              <td style={uStyle4}></td>
              <td style={uStyle4}></td>
            </tr>
            </tbody>
          </Table>
        </div>
        {/* END BODY ****************************************************************** */}
      </div>
    </ErrorBoundary>
  )
}

ConsultationFile.propTypes = {
  loader: PropTypes.bool,
  data: PropTypes.any,
}
