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
  useGetSickAgentsQuery, useGetSoonRetiredAgentsQuery, useGetUnavailableAgentsQuery
} from "../model/agent.stats.api.service";
import toast from "react-hot-toast";
import {useGetCurrentMissionsQuery, useGetMissionsNerExpirationsQuery} from "../model/mission.stats.api.service";
import {useGetAssignmentsNearExpirationsQuery, useGetCurrentAssignmentsQuery} from "../model/ass.stats.api.slice";

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
  
  const {
    data: soonRetiredAgents=[],
    isFetching: isSoonRetiredAgentsFetch,
    isError: isSoonRetiredAgentsError,
    error: soonRetiredAgentsError,
    refetch: soonRetiredAgentsRefetch
  } = useGetSoonRetiredAgentsQuery('LIST')
  
  const {
    data: currentMissions=[],
    isFetching: isCurrentMissionsFetch,
    isError: isCurrentMissionsError,
    error: currentMissionsError,
    refetch: currentMissionsRefetch
  } = useGetCurrentMissionsQuery('LIST')
  
  const {
    data: missionsNearExpirations=[],
    isFetching: isMissionNearExpirationsFetch,
    isError: isMissionNearExpirationsError,
    error: missionNearExpirationsError,
    refetch: missionNearExpirationsRefetch
  } = useGetMissionsNerExpirationsQuery('LIST')
  
  const {
    data: assignments=[],
    isFetching: isAssignmentsFetch,
    isError: isAssignmentsError,
    error: assignmentsError,
    refetch: assignmentsRefetch
  } = useGetCurrentAssignmentsQuery('LIST')
  
  const {
    data: nearExpAssignments=[],
    isFetching: isNearExpAssignmentsFetch,
    isError: isNearExpAssignmentsError,
    error: nearAssignmentsError,
    refetch: nearAssignmentsRefetch
  } = useGetAssignmentsNearExpirationsQuery('LIST')
  
  useEffect(() => {
    if (isNearExpAssignmentsError) {
      if (nearAssignmentsError?.error) toast.error(nearAssignmentsError.error)
      if (nearAssignmentsError?.data && nearAssignmentsError.data['hydra:description']) {
        toast.error(nearAssignmentsError.data['hydra:description'])
      }
    }
  }, [isNearExpAssignmentsError, nearAssignmentsError])
  
  useEffect(() => {
    if (isAssignmentsError) {
      if (assignmentsError?.error) toast.error(assignmentsError.error)
      if (assignmentsError?.data && assignmentsError.data['hydra:description']) {
        toast.error(assignmentsError.data['hydra:description'])
      }
    }
  }, [isAssignmentsError, assignmentsError])
  
  useEffect(() => {
    if (isMissionNearExpirationsError) {
      if (missionNearExpirationsError?.error) toast.error(missionNearExpirationsError.error)
      if (missionNearExpirationsError?.data && missionNearExpirationsError.data['hydra:description']) {
        toast.error(missionNearExpirationsError.data['hydra:description'])
      }
    }
  }, [isMissionNearExpirationsError, missionNearExpirationsError])
  
  useEffect(() => {
    if (isCurrentMissionsError) {
      if (currentMissionsError?.error) toast.error(currentMissionsError.error)
      if (currentMissionsError?.data && currentMissionsError.data['hydra:description']) {
        toast.error(currentMissionsError.data['hydra:description'])
      }
    }
  }, [isCurrentMissionsError, currentMissionsError])
  
  useEffect(() => {
    if (isSoonRetiredAgentsError) {
      if (soonRetiredAgentsError?.error) toast.error(soonRetiredAgentsError.error)
      if (soonRetiredAgentsError?.data && soonRetiredAgentsError.data['hydra:description']) {
        toast.error(soonRetiredAgentsError.data['hydra:description'])
      }
    }
  }, [isSoonRetiredAgentsError, soonRetiredAgentsError])
  
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
  
  const onCurrentAssRefetch = async () => await assignmentsRefetch()
  
  const onAssNearExpRefetch = async () => await nearAssignmentsRefetch()
  
  const onCurrentMissionsRefetch = async () => await currentMissionsRefetch()
  
  const onMissionsNearExpirationsRefetch = async () => await missionNearExpirationsRefetch()
  
  const onSoonRetiredAgentsRefetch = async () => await soonRetiredAgentsRefetch()
  
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
    onSoonRetiredAgentsRefetch()
    onCurrentMissionsRefetch()
    onMissionsNearExpirationsRefetch()
    onCurrentAssRefetch()
    onAssNearExpRefetch()
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
              isDeadAgentsFetch || isUnAgentsFetch || isRetiredAgentsFetch || isSoonRetiredAgentsFetch ||
              isCurrentMissionsFetch || isMissionNearExpirationsFetch || isAssignmentsFetch ||
              isNearExpAssignmentsFetch}
            onClick={onRefresh}>
            {(isActAgentsFetch || isInactAgentsFetch || isSickAgentsFetch || isLeaveAgentsFetch ||
                isDeadAgentsFetch || isUnAgentsFetch || isRetiredAgentsFetch || isSoonRetiredAgentsFetch ||
                isCurrentMissionsFetch || isMissionNearExpirationsFetch || isAssignmentsFetch ||
                isNearExpAssignmentsFetch) &&
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
            title='Actifs'
            icon='bi bi-people-fill'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/inactive-agents'
            loader={isInactAgentsFetch}
            total={InactiveAgents.length}
            md={4}
            title='Inactifs'
            icon='bi bi-person-dash'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/sick-agents'
            loader={isSickAgentsFetch}
            total={sickAgents.length}
            md={4}
            title='Malades'
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
            title='Décédés'
            icon='bi bi-sign-dead-end'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/unavailable-agents'
            loader={isUnAgentsFetch}
            total={unAgents.length}
            md={4}
            title='Indisponibles'
            icon='bi bi-shield-lock'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/retired-agents'
            loader={isRetiredAgentsFetch}
            total={retiredAgents.length}
            md={4}
            title='Retraités'
            icon='bi bi-person-up'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/soon-retired-agents'
            loader={isSoonRetiredAgentsFetch}
            total={soonRetiredAgents.length}
            md={4}
            title='Proches de la retraites'
            icon='bi bi-person-fill-up'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/current-missions'
            loader={isCurrentMissionsFetch}
            total={currentMissions.length}
            md={4}
            title='Missions en cours'
            icon='bi bi-brightness-high'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/missions-near-expirations'
            loader={isMissionNearExpirationsFetch}
            total={missionsNearExpirations.length}
            md={4}
            title='Missions proches expiration'
            icon='bi bi-brightness-alt-high'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/current-assignments'
            loader={isAssignmentsFetch}
            total={assignments.length}
            md={4}
            title='Affectations en cours'
            icon='bi bi-bookmark-check'/>
          
          <DashHeadingCardSection
            show
            isVisible
            to='/app/assignments-near-expirations'
            loader={isNearExpAssignmentsFetch}
            total={nearExpAssignments.length}
            md={4}
            title='Affectations proche expiration'
            icon='bi bi-bookmark'/>
          
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
