import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import DashHeadingCardSection from "../../dashboard/view/sections/DashHeadingCardSection";
import {Button, Row, Spinner} from "react-bootstrap";
import {
  useGetActiveAgentsQuery, useGetDeadAgentsQuery,
  useGetInactiveAgentsQuery, useGetLeaveAgentsQuery, useGetRetiredAgentsQuery,
  useGetSickAgentsQuery, useGetUnavailableAgentsQuery
} from "../model/agent.stats.api.service";
import toast from "react-hot-toast";

const AgentStats = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  const {
    data: activeAgents=[],
    isFetching: isActAgentsFetch,
    isError: isActAgentsError,
    error: actAgentsError,
    refetch: actAgentsRefetch
  } = useGetActiveAgentsQuery('LIST')
  
  const {
    data: InactiveAgents=[],
    isFetching: isInactAgentsFetch,
    isError: isInactAgentsError,
    error: InAgentsError,
    refetch: InAgentsRefetch
  } = useGetInactiveAgentsQuery('LIST')
  
  const {
    data: sickAgents=[],
    isFetching: isSickAgentsFetch,
    isError: isSickAgentsError,
    error: sickAgentsError,
    refetch: sickAgentsRefetch
  } = useGetSickAgentsQuery('LIST')
  
  const {
    data: leaveAgents=[],
    isFetching: isLeaveAgentsFetch,
    isError: isLeaveAgentsError,
    error: leaveAgentsError,
    refetch: leaveAgentsRefetch
  } = useGetLeaveAgentsQuery('LIST')
  
  const {
    data: deadAgents=[],
    isFetching: isDeadAgentsFetch,
    isError: isDeadAgentsError,
    error: deadAgentsError,
    refetch: deadAgentsRefetch
  } = useGetDeadAgentsQuery('LIST')
  
  const {
    data: unAgents=[],
    isFetching: isUnAgentsFetch,
    isError: isUnAgentsError,
    error: unAgentsError,
    refetch: unAgentsRefetch
  } = useGetUnavailableAgentsQuery('LIST')
  
  const {
    data: retiredAgents=[],
    isFetching: isRetiredAgentsFetch,
    isError: isRetiredAgentsError,
    error: retiredAgentsError,
    refetch: retiredAgentsRefetch
  } = useGetRetiredAgentsQuery('LIST')
  
  useEffect(() => {
    if (isRetiredAgentsError) {
      if (retiredAgentsError?.error) toast.error(retiredAgentsError.error)
      if (retiredAgentsError?.data && retiredAgentsError.data['hydra:description']) {
        toast.error(retiredAgentsError.data['hydra:description'])
      }
    }
  }, [isRetiredAgentsError, retiredAgentsError])
  
  useEffect(() => {
    if (isUnAgentsError) {
      if (unAgentsError?.error) toast.error(unAgentsError.error)
      if (unAgentsError?.data && unAgentsError.data['hydra:description']) {
        toast.error(unAgentsError.data['hydra:description'])
      }
    }
  }, [isUnAgentsError, unAgentsError])
  
  useEffect(() => {
    if (isDeadAgentsError) {
      if (deadAgentsError?.error) toast.error(deadAgentsError.error)
      if (deadAgentsError?.data && deadAgentsError.data['hydra:description']) {
        toast.error(deadAgentsError.data['hydra:description'])
      }
    }
  }, [isDeadAgentsError, deadAgentsError])
  
  useEffect(() => {
    if (isLeaveAgentsError) {
      if (leaveAgentsError?.error) toast.error(leaveAgentsError.error)
      if (leaveAgentsError?.data && leaveAgentsError.data['hydra:description']) {
        toast.error(leaveAgentsError.data['hydra:description'])
      }
    }
  }, [isLeaveAgentsError, leaveAgentsError])
  
  useEffect(() => {
    if (isSickAgentsError) {
      if (sickAgentsError?.error) toast.error(sickAgentsError.error)
      if (sickAgentsError?.data && sickAgentsError.data['hydra:description']) {
        toast.error(sickAgentsError.data['hydra:description'])
      }
    }
  }, [isSickAgentsError, sickAgentsError])
  
  useEffect(() => {
    if (isInactAgentsError) {
      if (InAgentsError?.error) toast.error(InAgentsError.error)
      if (InAgentsError?.data && InAgentsError.data['hydra:description']) {
        toast.error(InAgentsError.data['hydra:description'])
      }
    }
  }, [isInactAgentsError, InAgentsError])
  
  useEffect(() => {
    if (isActAgentsError) {
      if (actAgentsError?.error) toast.error(actAgentsError.error)
      if (actAgentsError?.data && actAgentsError.data['hydra:description']) {
        toast.error(actAgentsError.data['hydra:description'])
      }
    }
  }, [isActAgentsError, actAgentsError])
  
  const onRetiredAgentsRefetch = async () => await retiredAgentsRefetch()
  
  const onUnAgentsRefetch = async () => await unAgentsRefetch()
  
  const onDeadAgentsRefetch = async () => await deadAgentsRefetch()
  
  const onLeaveAgentsRefetch = async () => await leaveAgentsRefetch()
  
  const onSickAgentsRefetch = async () => await sickAgentsRefetch()
  
  const onInActAgentsRefetch = async () => await InAgentsRefetch()
  
  const onActAgentsRefetch = async () => await actAgentsRefetch()
  
  const onRefresh = () => {
    onActAgentsRefetch()
    onInActAgentsRefetch()
    onSickAgentsRefetch()
    onLeaveAgentsRefetch()
    onDeadAgentsRefetch()
    onUnAgentsRefetch()
    onRetiredAgentsRefetch()
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Rapports agents'/>
      <PageLayout>
        <AppBreadcrumb title='Rapports agents'/>
        
        <div className='text-end'>
          <Button
            disabled={
            isActAgentsFetch || isInactAgentsFetch || isSickAgentsFetch || isLeaveAgentsFetch ||
              isDeadAgentsFetch || isUnAgentsFetch || isRetiredAgentsFetch}
            onClick={onRefresh}>
            {(isActAgentsFetch || isInactAgentsFetch || isSickAgentsFetch || isLeaveAgentsFetch ||
                isDeadAgentsFetch || isUnAgentsFetch || isRetiredAgentsFetch) &&
              <Spinner animation='grow' size='sm' className='me-1'/>}
            Actualiser
          </Button>
        </div>
        
        <Row>
          <DashHeadingCardSection
            show
            isVisible
            to='/app/active-agents'
            loader={isActAgentsFetch}
            total={activeAgents.length}
            md={4}
            title='Agents actifs'
            icon='bi bi-people-fill'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/inactive-agents'
            loader={isInactAgentsFetch}
            total={InactiveAgents.length}
            md={4}
            title='Agents inactifs'
            icon='bi bi-person-dash'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/sick-agents'
            loader={isSickAgentsFetch}
            total={sickAgents.length}
            md={4}
            title='Agents malades'
            icon='bi bi-heart-pulse'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/leave-agents'
            loader={isLeaveAgentsFetch}
            total={leaveAgents.length}
            md={4}
            title='Agents en congé'
            icon='bi bi-joystick'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/dead-agents'
            loader={isDeadAgentsFetch}
            total={deadAgents.length}
            md={4}
            title='Agents décédés'
            icon='bi bi-sign-dead-end'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/unavailable-agents'
            loader={isUnAgentsFetch}
            total={unAgents.length}
            md={4}
            title='Agents indisponibles'
            icon='bi bi-shield-lock'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/retired-agents'
            loader={isRetiredAgentsFetch}
            total={retiredAgents.length}
            md={4}
            title='Agents retraités'
            icon='bi bi-person-up'/>
          
          {/*<DashHeadingCardSection
            show
            isVisible
            md={4}
            total={18}
            nb={2}
            title='Fiches'
            wording='Completé(e)'
            icon='bi bi-folder-fill'/>
            
            <DashHeadingCardSection
            show
            isVisible
            md={4}
          total={18}
          nb={2}
          title='Fiches'
          wording='Completé(e)'
          icon='bi bi-folder-fill'/>*/}
        </Row>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(AgentStats)
