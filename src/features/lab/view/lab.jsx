import {useDispatch} from "react-redux";
import {memo, useEffect} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import LabList from "./labList";

const Lab = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'consultations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Laboratoire'/>
      <PageLayout>
        <AppBreadcrumb title='Laboratoire'/>
        <Card>
          <LabList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Lab)
