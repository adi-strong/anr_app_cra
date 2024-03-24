import {useDispatch} from "react-redux";
import {memo, useEffect, useRef, useState} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Link} from "react-router-dom";
import {Button, Card} from "react-bootstrap";
import {useReactToPrint} from "react-to-print";
import LabFormModal from "./labFormModal";
import LabDetails from "./labDetails";

const ShowLab = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'consultations' }))
  }, [dispatch])
  
  const [show, setShow] = useState(false)
  const printRef = useRef()
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })
  
  const toggleShow = () => setShow(!show)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Analyses du labo'/>
      <PageLayout>
        <AppBreadcrumb title={`Analyses du labo / Résultat(s)`}/>
        <Link to='/app/lab'>
          <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
        </Link>
        
        <Card className='mt-5 mb-5'>
          <Card.Body>
          </Card.Body>
        </Card>
        
        <div className='d-flex justify-content-between'>
          <Button
            disabled={false}
            size='sm'
            onClick={toggleShow}>
            <i className='bi bi-gear-wide'/> Paramètres <i className='bi bi-plus'/>
          </Button>
          
          <Button
            disabled={false}
            size='sm'
            variant='info'
            className='text-light'
            onClick={handlePrint}>
            <i className='bi bi-printer'/> Imprimer
          </Button>
        </div>
        
        <Card className='mt-5'>
          <Card.Body>
            <div className='container-fluid' ref={printRef}>
              <LabDetails/>
            </div>
          </Card.Body>
        </Card>
      </PageLayout>
      
      <LabFormModal show={show} onHide={toggleShow}/>
    </ErrorBoundary>
  )
}

export default memo(ShowLab)
