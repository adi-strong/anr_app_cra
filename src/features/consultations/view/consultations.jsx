import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import ConsultationsList from "./consultationsList";

const Consultations = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'consultations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Consultations'/>
      <PageLayout>
        <AppBreadcrumb title='Consultations'/>
        <Card>
          <ConsultationsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Consultations)
