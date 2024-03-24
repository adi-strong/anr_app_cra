import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";

export default function ProfileRendezvousList() {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
    </ErrorBoundary>
  )
}
