import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card, Tab, Tabs} from "react-bootstrap";
import InvoicesList from "./InvoicesList";
import ContractsInvoices from "./ContractsInvoices";
import NonContractsInvoices from "./NonContractsInvoices";

const tabs = [
  {title: 'Toutes', event: 'all'},
  {title: 'Conventionnés', event: 'covenants'},
  {title: 'Non conventionnés', event: 'invoices'},
]

const Invoices = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'finances' }))
  }, [dispatch])
  
  const [key, setKey] = useState('all')
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Factures'/>
      <PageLayout>
        <AppBreadcrumb title='Factures'/>
        <Card>
          <Card.Header className='bg-white pt-5'>
            <Card.Title className='mx-2'>Liste des factures</Card.Title>
            
            <Tabs activeKey={key} variant='pills' onSelect={k => setKey(k)} className='p-0 px-3'>
              {tabs.length && tabs.map(t =>
                <Tab key={t.event} title={t.title} eventKey={t.event}/>)}
            </Tabs>
          </Card.Header>
          
          {key === 'all' && <InvoicesList/>}
          {key === 'covenants' && <ContractsInvoices/>}
          {key === 'invoices' && <NonContractsInvoices/>}
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Invoices)
