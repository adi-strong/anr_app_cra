import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import PrescriptionsList from "./prescriptionsList";
import {Card} from "react-bootstrap";

const Prescriptions = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'prescriptions' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Ordonnances'/>
      <PageLayout>
        <AppBreadcrumb title='Ordonnances / Prescriptions'/>
        <Card className='h-100'>
          <PrescriptionsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Prescriptions)
