import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Link} from "react-router-dom";
import {Button, Card, Tab, Tabs} from "react-bootstrap";
import {useReactToPrint} from "react-to-print";
import ConsultationFile from "./consultationFile";
import EditConsultation from "./editConsultation";
import ConsultObservationForm from "./consultObservationForm";
import HospitalizationForm from "./hospitalizationForm";

const tabs = [
  {label: 'Fiche', event: 'file'},
  {label: 'Suivi & Traitements', event: 'treatments'},
]

const ShowConsultation = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'consultations' }))
  }, [dispatch])
  
  const printRef = useRef()
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })
  
  const [key, setKey] = useState('file')
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Fiche de consultation'/>
      <PageLayout>
        <AppBreadcrumb title={`Fiche de consultation `}/>
        
        <div className='d-flex justify-content-between'>
          <Link to='/app/consultations'>
          <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
        </Link>
          
          {key === 'file' &&
            <Button disabled={false} size='sm' variant='info' className='text-light' onClick={handlePrint}>
              <i className='bi bi-printer-fill'/> Imprimer
            </Button>}
        </div>
        
        <Card className='mt-5'>
          <Card.Body>
            <Tabs activeKey={key} variant='pills' onSelect={k => setKey(k)}>
              {tabs.length > 0 && tabs.map(t =>
                <Tab key={t.event} title={t.label} eventKey={t.event}/>)}
            </Tabs>
            
            {key === 'file' && <ConsultationFile printRef={printRef}/>}
            {key === 'treatments' && <EditConsultation/>}
          </Card.Body>
        </Card>
        
        {key === 'treatments' && (
          <>
            <HospitalizationForm/>
            <ConsultObservationForm/>
          </>
        )}
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ShowConsultation)
