import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";

export default function EditProfileForm() {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
    </ErrorBoundary>
  )
}
