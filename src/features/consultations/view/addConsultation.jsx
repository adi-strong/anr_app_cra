import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Link} from "react-router-dom";
import ConsultationForm from "./consultationForm";

const AddConsultation = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'consultations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Nouvelle consultation'/>
      <PageLayout>
        <AppBreadcrumb title='Anamèse et signes vitaux / Examen clinic' subTitle='Nouvelle fiche'/>
        <Link to='/app/consultations'>
          <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
        </Link>
        
        <ConsultationForm/>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(AddConsultation)
