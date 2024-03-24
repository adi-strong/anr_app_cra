import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, FieldsAlert, PageHeading} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Link} from "react-router-dom";
import {Card} from "react-bootstrap";
import LabDetails from "../../lab/view/labDetails";
import PrescriptionForm from "./prescriptionForm";

const ShowDoctorPrescription = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'consultations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Prescription du médecin'/>
      <PageLayout>
        <AppBreadcrumb title={`Prescription du médecin`}/>
        <Link to='/app/doctors-prescriptions'>
          <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
        </Link>
        
        <Card className='mt-5'>
          <Card.Body>
            <LabDetails/>
          </Card.Body>
        </Card>
        
        <Card className='mt-5'>
          <Card.Body>
            <h3 className='card-title'><i className='bi bi-file-earmark-text'/> Formulaire de prescription</h3>
            <FieldsAlert/>
            <PrescriptionForm/>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ShowDoctorPrescription)
