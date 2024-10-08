import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../index";
import {Button, Dropdown, Form} from "react-bootstrap";
import avatar from "../../../assets/images/avatar/default_profile.jpg";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {onResetConfig} from "../../../features/config/config.slice";
import {useDispatch, useSelector} from "react-redux";
import {logout} from "../../../features/auth/services/auth.slice";
import {api} from "../../../app/store";
import {toggleShowTheme} from "../../../features/config/theme.slice";
import {useState} from "react";
import CreateNewsModal from "../../../features/news/view/createNewsModal";

export default function HeaderMenu() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {user: session} = useSelector(state => state.auth)
  const {show} = useSelector(state => state.theme)
  const [open, setOpen] = useState(false);
  
  const toggleOpen = () => setOpen(!open);
  
  function onUserMenuClick(to) {
    if (to === '/app/profile') navigate(to)
    else navigate(to)
  }
  
  function onLogout() {
    toast('À bientôt.', {
      icon: '👏',
      style: {
        background: '#537ff5',
        color: '#fff',
      }
    })
    
    dispatch(onResetConfig())
    dispatch(api.util.resetApiState())
    dispatch(logout())
  }
  
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <ul className='navbar-nav navbar-right-wrap ms-auto d-flex nav-top-wrap'>
        <li>
          <Button
            variant='light'
            onClick={toggleOpen}
            className='btn-icon rounded-circle indicator indicator-primary text-muted'>
            <i className='bi bi-file-earmark-plus icon-xs'/>
          </Button>
        </li>
        
        <Dropdown
          as='li'
          className='ms-2'
          children={
            <>
              <Dropdown.Toggle
                style={{ cursor: 'pointer' }}
                as='a'
                className='rounded-circle'>
                <div className='avatar avatar-md avatar-indicators avatar-online'>
                  <img
                    src={session && session?.image ? session.image : avatar} alt=''
                    className='rounded-circle'/>
                </div>
              </Dropdown.Toggle>
              
              <Dropdown.Menu className='dropdown-menu-end'>
                <div className="px-4 pb-0 pt-2">
                  <div className='lh-1'>
                    <h5 className="mb-1">
                      {session && <span className='text-capitalize'>{session?.fullName}</span>}
                    </h5>
                    <Link to='/app/profile' className='text-inherit fs-6'>Voir mon profil</Link>
                  </div>
                  <Dropdown.Divider className='mt-3 mb-2'/>
                  
                  <ul className='list-unstyled'>
                    <li>
                      <Dropdown.Item onClick={() => onUserMenuClick('/app/profile')}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-user me-2 icon-xxs dropdown-item-icon">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx={12} cy={7} r={4}/>
                        </svg>Profil
                      </Dropdown.Item>
                    </li>
                    
                    <li>
                      <Dropdown.Item onClick={() => onUserMenuClick('/app/help')}>
                        <i className='bi bi-question-circle mx-1 me-2 icon-xxs dropdown-item-icon'/>
                        Aide
                      </Dropdown.Item>
                    </li>
                    
                    <li>
                      <Dropdown.Item onClick={onLogout}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="feather feather-power me-2 icon-xxs dropdown-item-icon">
                          <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
                          <line x1={12} y1={2} x2={12} y2={12}/>
                        </svg>Déconnexion
                      </Dropdown.Item>
                    </li>
                  </ul>
                </div>
              </Dropdown.Menu>
            </>
          }/>
        
        <li className='justify-content-center d-flex pt-2 mx-3'>
          <i className={`bi bi-sun${!show ? '-fill text-primary' : ''} me-2`}/>
          <Form.Switch value={show} checked={show} onChange={() => dispatch(toggleShowTheme())}/>
          <i className={`bi bi-moon${show ? '-fill text-primary' : ''}`}/>
        </li>
      </ul>
      
      <CreateNewsModal show={open} onHide={toggleOpen}/>
    </ErrorBoundary>
  )
}
