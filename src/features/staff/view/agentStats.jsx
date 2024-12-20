import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, AuthorizedComponent, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import DashHeadingCardSection from "../../dashboard/view/sections/DashHeadingCardSection";
import {Button, Col, Row, Spinner} from "react-bootstrap";
import {
  useGetActiveAgentsQuery, useGetDeadAgentsQuery,
  useGetInactiveAgentsQuery, useGetLeaveAgentsQuery, useGetRetiredAgentsQuery,
  useGetSickAgentsQuery, useGetSoonRetiredAgentsQuery, useGetUnavailableAgentsQuery
} from "../model/agent.stats.api.service";
import {useGetCurrentMissionsQuery, useGetMissionsNerExpirationsQuery} from "../model/mission.stats.api.service";
import {useGetAssignmentsNearExpirationsQuery, useGetCurrentAssignmentsQuery} from "../model/ass.stats.api.slice";
import {Link} from "react-router-dom";

const AgentStats = () => {
  const dispatch = useDispatch()
  const {user: session} = useSelector((state) => state.auth)
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  const {
    data: activeAgents=[],
    isFetching: isActAgentsFetch,
    refetch: actAgentsRefetch
  } = useGetActiveAgentsQuery('LIST')
  
  const {
    data: InactiveAgents=[],
    isFetching: isInactAgentsFetch,
    refetch: InAgentsRefetch
  } = useGetInactiveAgentsQuery('LIST')
  
  const {
    data: sickAgents=[],
    isFetching: isSickAgentsFetch,
    refetch: sickAgentsRefetch
  } = useGetSickAgentsQuery('LIST')
  
  const {
    data: leaveAgents=[],
    isFetching: isLeaveAgentsFetch,
    refetch: leaveAgentsRefetch
  } = useGetLeaveAgentsQuery('LIST')
  
  const {
    data: deadAgents=[],
    isFetching: isDeadAgentsFetch,
    refetch: deadAgentsRefetch
  } = useGetDeadAgentsQuery('LIST')
  
  const {
    data: unAgents=[],
    isFetching: isUnAgentsFetch,
    refetch: unAgentsRefetch
  } = useGetUnavailableAgentsQuery('LIST')
  
  const {
    data: retiredAgents=[],
    isFetching: isRetiredAgentsFetch,
    refetch: retiredAgentsRefetch
  } = useGetRetiredAgentsQuery('LIST')
  
  const {
    data: soonRetiredAgents=[],
    isFetching: isSoonRetiredAgentsFetch,
    refetch: soonRetiredAgentsRefetch
  } = useGetSoonRetiredAgentsQuery('LIST')
  
  const {
    data: currentMissions=[],
    isFetching: isCurrentMissionsFetch,
    refetch: currentMissionsRefetch
  } = useGetCurrentMissionsQuery('LIST')
  
  const {
    data: missionsNearExpirations=[],
    isFetching: isMissionNearExpirationsFetch,
    refetch: missionNearExpirationsRefetch
  } = useGetMissionsNerExpirationsQuery('LIST')
  
  const {
    data: assignments=[],
    isFetching: isAssignmentsFetch,
    refetch: assignmentsRefetch
  } = useGetCurrentAssignmentsQuery('LIST')
  
  const {
    data: nearExpAssignments=[],
    isFetching: isNearExpAssignmentsFetch,
    refetch: nearAssignmentsRefetch
  } = useGetAssignmentsNearExpirationsQuery('LIST')
  
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
        
        {session && session?.roles && session.roles.length > 0 && (
          <AuthorizedComponent userRoles={session.roles} allowedRoles={['ROLE_AG', 'ROLE_SUPER_ADMIN']}>
            <Row>
              <Col className='mb-2'>
                <Link to='/app/others-reports'>
                  <i className='bi bi-activity'/> Rapports paiements salaires
                </Link>
              </Col>
              
              <Col className='mb-2 text-end'>
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
              </Col>
            </Row>
            
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
          </AuthorizedComponent>
        )}
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(AgentStats)
