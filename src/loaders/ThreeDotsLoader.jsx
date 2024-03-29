import {ErrorBoundary} from "react-error-boundary";
import {ThreeDots} from "react-loader-spinner";
import {FallBackRender} from "../components";

export default function ThreeDotsLoader({ loading = false, height = 80, width = 80, radius = 9 }) {
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <ThreeDots
        height={height}
        width={width}
        radius={radius}
        color="#0d6efd"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={loading} />
    </ErrorBoundary>
  )
}
