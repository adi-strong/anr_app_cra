import {ErrorBoundary} from "react-error-boundary";
import {memo, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onResetConfig} from "../../config/config.slice";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {Button, Col, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import bgImg from '../../../assets/images/background/profile-cover.jpg';
import avatar1 from '../../../assets/images/avatar/default_profile.jpg';
import {Link} from "react-router-dom";
import {PageLayout} from "../../../layouts";
import {profileTabs} from "../model";
import ProfileOverviewTab from "./profileOverviewTab";
import ProfilePasswordTab from "./profilePasswordTab";
import {useGetUniqueUserQuery} from "../../staff/model/user.api.slice";
import {entrypoint} from "../../../app/store";

const Profile = () => {
  const dispatch = useDispatch()
  
  const {user: session} = useSelector(state => state.auth)
  const {data, isLoading, isError, isFetching, refetch} = useGetUniqueUserQuery(session?.id)
  
  useEffect(() => {
    dispatch(onResetConfig())
  }, [dispatch])
  
  const [key, setKey] = useState('overview')
  
  const onRefresh = async () => await refetch()
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Mon Profile'/>
      <PageLayout>
        <AppBreadcrumb title='Profil utilisateur'/>
        
        <Row className='align-items-center'>
          <Col xxl={12}>
            <div
              className='pt-20 rounded-top'
              style={{
                background: `url(${bgImg}) no-repeat`,
                backgroundSize: 'cover',
            }}/>
            
            <div className='bg-white profile-card rounded-bottom smooth-shadow-sm'>
              <div className='d-flex align-items-center justify-content-between pt-4 pb-6 px-4'>
                <div className='d-flex align-items-center'>
                  <div className='avatar-xxl avatar-indicators avatar-online me-2
                      position-relative d-flex justify-content-end
                      align-items-end mt-n10'>
                    <img
                      src={!isError && data && data?.agentAccount && data.agentAccount?.profile
                        ? entrypoint+data.agentAccount.profile?.contentUrl
                        : avatar1}
                      className="avatar-xxl rounded-circle border border-4 border-white-color-40" alt=""/>
                  </div>
                  
                  <div className='lh-1'>
                    <h2 className="mb-0">
                      {isLoading && <small className='fw-normal'>Chargement en cours...</small>}
                      {!(isError && isLoading) && data && <span className="text-capitalize">{data?.fullName}</span>}
                      <Link
                        to="#!"
                        className="text-decoration-none"
                        data-bs-toggle="tooltip"
                        data-placement="top"
                        title="" data-original-title="Beginner"/>
                    </h2>
                    
                    <p className="mb-0 d-block">
                      {!(isError && isLoading) && data && `@${data.username}`}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Button
                    disabled={isFetching}
                    variant='outline-primary'
                    className="d-none d-md-block"
                    onClick={onRefresh}>
                    {isFetching && <Spinner animation='grow' size='sm' className='me-1'/>}
                    Actualiser
                  </Button>
                </div>
              </div>
              
              <Tabs
                onSelect={k => setKey(k)}
                activeKey={key}
                variant='pills'
                className='nav-lt-tab px-4'>
                {profileTabs.length > 0 && profileTabs.map((p, i) =>
                  <Tab key={i} title={p.title} eventKey={p.event}/>)}
              </Tabs>
            </div>
            
            <div className='py-6'>
              <Row>
                {key === 'overview' &&
                  <ProfileOverviewTab
                    loader={isLoading}
                    error={isError}
                    data={data}
                  />}
                
                {key === 'password' &&
                  <ProfilePasswordTab
                    loader={isLoading}
                    err={isError}
                    data={data}
                  />}
              </Row>
            </div>
          </Col>
        </Row>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Profile)
