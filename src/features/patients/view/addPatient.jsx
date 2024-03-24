import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import PatientForm from "./patientForm";
import {Link} from "react-router-dom";

const AddPatient = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'patients' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Enregistrement patient(e)'/>
      <PageLayout>
        <AppBreadcrumb title='Nouveau Patient'/>
        <Link to='/app/patients'><i className='bi bi-box-arrow-in-down-left'/> Retour à la liste</Link>
        <Card className='mt-5'>
          <Card.Body>
            <PatientForm/>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(AddPatient)
