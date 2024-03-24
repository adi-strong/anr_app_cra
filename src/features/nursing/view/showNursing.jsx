import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, AppOffCanvas, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Link} from "react-router-dom";
import {Button, Card, Table} from "react-bootstrap";
import ConsultationFileHeader from "../../consultations/view/consultationFileHeader";
import {useReactToPrint} from "react-to-print";
import EditNursingForm from "./editNursingForm";
import NursingFormModal from "./nursingFormModal";

const nStyle = {
  fontWeight: 800,
  color: '#0909b0'
}

const uStyle4 = { borderBottom: '1px dotted #0909b0' }

const ShowNursing = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'consultations' }))
  }, [dispatch])
  
  const printRef = useRef()
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })
  
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  
  const toggleShow = () => setShow(!show)
  const toggleOpen = () => setOpen(!open)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Nursing'/>
      <PageLayout>
        <AppBreadcrumb title={`Fiche de traitement(s) `}/>
        
        <div className='d-flex justify-content-between'>
          <Link to='/app/nursing'>
            <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
          </Link>
          
          <div>
            <Button disabled={false} size='sm' variant='info' className='text-light' onClick={handlePrint}>
              <i className='bi bi-printer-fill'/> Imprimer
            </Button>
          </div>
        </div>
        
        <Card className='mt-5'>
          <Card.Body>
            <div className='container-fluid' ref={printRef}>
              <ConsultationFileHeader/>
              
              <div className='text-end me-9'>
                <Button disabled={false} type='button' variant='link' className='mt-5' onClick={toggleOpen}>
                  <i className='bi bi-plus-square-fill text-danger'/>
                </Button>
                
                <Button disabled={false} type='button' variant='link' className='mt-5' onClick={toggleShow}>
                  <i className='bi bi-plus-square-fill'/>
                </Button>
              </div>
              
              <div className='px-8 pe-8 pt-5'>
                <Table borderless>
                  <thead>
                  <tr>
                    <th style={nStyle}>DATE</th>
                    <th style={nStyle}> - OBSERVATIONS / TRAITEMENTS</th>
                  </tr>
                  </thead>
                  
                  <tbody>
                  <tr>
                    <td style={uStyle4}></td>
                    <td style={uStyle4}></td>
                  </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </Card.Body>
        </Card>
        
        <AppOffCanvas
          title={<><i className='bi bi-plus-square-fill'/> Observation(s)</>}
          children={<EditNursingForm onHide={toggleShow}/>}
          show={show}
          onHide={toggleShow}/>
        
        <NursingFormModal show={open} onHide={toggleOpen}/>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ShowNursing)
