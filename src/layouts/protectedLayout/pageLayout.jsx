import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../components";
import {Container} from "react-bootstrap";

export default function PageLayout({children}) {
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <Container fluid className='p-6'>
        {children}
      </Container>
    </ErrorBoundary>
  )
}
