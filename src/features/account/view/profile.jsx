import {ErrorBoundary} from "react-error-boundary";
import {memo, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onResetConfig} from "../../config/config.slice";
import {AppBreadcrumb, AppOffCanvas, FallBackRender, PageHeading} from "../../../components";
import {Button, Col, Row, Tab, Tabs} from "react-bootstrap";
import bgImg from '../../../assets/images/background/profile-cover.jpg';
import avatar1 from '../../../assets/images/avatar/avatar-1.jpg';
import {Link} from "react-router-dom";
import {PageLayout} from "../../../layouts";
import {profileTabs} from "../model";
import ProfileOverviewTab from "./profileOverviewTab";
import ProfilePasswordTab from "./profilePasswordTab";
import ProfileRendezvousTab from "./profileRendezvousTab";
import EditProfileForm from "./editProfileForm";

const Profile = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onResetConfig())
  }, [dispatch])
  
  const [key, setKey] = useState('overview')
  const [open, setOpen] = useState(false)
  
  const toggleOpen = () => setOpen(!open)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Mon Profile'/>
      <PageLayout>
        <AppBreadcrumb title='Profil'/>
        <Row className='align-items-center'>
          <Col xxl={12}>
            <div
              className='pt-20 rounded-top'
              style={{
                background: `url(${bgImg}) no-repeat`,
                backgroundSize: 'cover',
            }}/>
            
            <div className='bg-white rounded-bottom smooth-shadow-sm'>
              <div className='d-flex align-items-center justify-content-between pt-4 pb-6 px-4'>
                <div className='d-flex align-items-center'>
                  <div className='avatar-xxl avatar-indicators avatar-online me-2
                      position-relative d-flex justify-content-end
                      align-items-end mt-n10'>
                    <img
                      src={avatar1}
                      className="avatar-xxl
                        rounded-circle border border-4 border-white-color-40" alt=""/>
                  </div>
                  
                  <div className='lh-1'>
                    <h2 className="mb-0">Jitu Chauhan
                      <Link
                        to="#!"
                        className="text-decoration-none"
                        data-bs-toggle="tooltip"
                        data-placement="top"
                        title="" data-original-title="Beginner"/>
                    </h2>
                    
                    <p className="mb-0 d-block">@imjituchauhan</p>
                  </div>
                </div>
                
                <div>
                  <Button
                    variant='outline-primary'
                    className="d-none d-md-block"
                    onClick={toggleOpen}>
                    Modifier Profil
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
                {key === 'overview' && <ProfileOverviewTab/>}
                {key === 'password' && <ProfilePasswordTab/>}
                {key === 'rendezvous' && <ProfileRendezvousTab/>}
              </Row>
            </div>
          </Col>
        </Row>
      </PageLayout>
      
      <AppOffCanvas
        show={open}
        onHide={toggleOpen}
        title={<><i className='bi bi-pencil'/> Modification du Profil</>}
        children={<EditProfileForm/>} />
    </ErrorBoundary>
  )
}

export default memo(Profile)
