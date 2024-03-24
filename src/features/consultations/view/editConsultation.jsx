import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import EditConsultForm from "./editConsultForm";
import PropTypes from "prop-types";

export default function EditConsultation({loader, data}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <EditConsultForm loader={false} data={data}/>
    </ErrorBoundary>
  )
}

EditConsultation.propTypes = {
  loader: PropTypes.bool,
  data: PropTypes.any,
}
