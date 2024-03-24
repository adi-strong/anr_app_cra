import {useDispatch} from "react-redux";
import {memo, useEffect} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import DoctorsPrescriptionsList from "./doctorsPrescriptionsList";

const DoctorsPrescriptions = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'consultations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Prescriptions médicales'/>
      <PageLayout>
        <AppBreadcrumb title='Prescriptions Médicales'/>
        <Card>
          <DoctorsPrescriptionsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(DoctorsPrescriptions)
