import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import TreatmentsList from "./treatmentsList";
import {Card} from "react-bootstrap";

const Treatments = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Traitements'/>
      <PageLayout>
        <AppBreadcrumb title='Traitements'/>
        <Card>
          <TreatmentsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Treatments)
