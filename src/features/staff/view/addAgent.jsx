import {memo, useEffect} from "react";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Link} from "react-router-dom";
import {Card} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import AgentForm from "./agentForm";

const AddAgent = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Enregistrement patient(e)'/>
      <PageLayout>
        <AppBreadcrumb title='Nouvel Agent'/>
        <Link to='/app/agents'><i className='bi bi-box-arrow-in-down-left'/> Retour à la liste</Link>
        <Card className='mt-5'>
          <Card.Body>
            <AgentForm/>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(AddAgent)
