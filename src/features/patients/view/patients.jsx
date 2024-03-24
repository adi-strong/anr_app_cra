import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import PatientsList from "./patientsList";

const ConsultationTypes = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'patients' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Patients'/>
      <PageLayout>
        <AppBreadcrumb title='Patients'/>
        <Card>
          <PatientsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ConsultationTypes)
