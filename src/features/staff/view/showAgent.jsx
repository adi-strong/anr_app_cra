import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Link} from "react-router-dom";
import {Card} from "react-bootstrap";

const ShowAgent = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Agent'/>
      <PageLayout>
        <AppBreadcrumb title={`Agent Anita`}/>
        <Link to='/app/agents'>
          <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
        </Link>
        
        <Card className='mt-5'>
          <Card.Body>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ShowAgent)
