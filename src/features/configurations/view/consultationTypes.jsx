import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import ConsultationTypesList from "./consultationTypesList";

const ConsultationTypes = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Types de fiches de consultations'/>
      <PageLayout>
        <AppBreadcrumb title='Types de fiches'/>
        <Card>
          <ConsultationTypesList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ConsultationTypes)
