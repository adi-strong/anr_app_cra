import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Link} from "react-router-dom";
import {Card} from "react-bootstrap";
import ShowInvoiceSummary from "./showInvoiceSummary";
import ShowInvoiceDetails from "./showInvoiceDetails";

const ShowInvoice = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'finances' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Nursing'/>
      <PageLayout>
        <AppBreadcrumb title={`Facturation malade`}/>
        <Link to='/app/invoices'>
          <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
        </Link>
        
        <Card className='mt-5'>
          <Card.Body>
            <ShowInvoiceSummary/>
          </Card.Body>
        </Card>
        
        <Card className='mt-5'>
          <Card.Body>
            <ShowInvoiceDetails/>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ShowInvoice)
