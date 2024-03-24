import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card, Tab, Tabs} from "react-bootstrap";
import {fileTabs} from "../model";
import ReceptionFilesList from "./receptionFilesList";
import ConsultationsFilesList from "./consultationsFilesList";
import RendezVousFilesList from "./RendezVousFilesList";

const Reception = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'reception' }))
  }, [dispatch])
  
  const [key, setKey] = useState('files')
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Réception'/>
      <PageLayout>
        <AppBreadcrumb title='Réception'/>
        <Card>
          <Card.Body>
            <Tabs
              activeKey={key}
              onSelect={k => setKey(k)}
              variant='pills'
              className='nav-line-bottom'>
              {fileTabs.map(f =>
                <Tab key={f.event} title={f.title} eventKey={f.event} className='pt-5'>
                  {f.event === 'files' && <ReceptionFilesList/>}
                  {f.event === 'consultations' && <ConsultationsFilesList/>}
                  {f.event === 'rendezvous' && <RendezVousFilesList/>}
                </Tab>)}
            </Tabs>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Reception)
