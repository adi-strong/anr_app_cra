import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import AgentsList from "./agentsList";
import {Card} from "react-bootstrap";

const Agents = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Agents'/>
      <PageLayout>
        <AppBreadcrumb title='Agents'/>
        <Card>
          <AgentsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Agents)
