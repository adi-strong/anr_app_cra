import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, Header} from "../../components";
import Aside from "../../components/Menus/Aside/Aside";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useGetUniqueUserQuery} from "../../features/staff/model/user.api.slice";
import {setAuthUser} from "../../features/auth/services/auth.slice";
import {onAuthUser} from "../../features/staff/model/user.service";
import toast from "react-hot-toast";

function ProtectedLayout() {
  const dispatch = useDispatch()
  const location = useLocation()
  
  const [isToggled, setIsToggled] = useState(false)
  
  const {token, user} = useSelector(state => state.auth)
  const {data: session, isError, error} = useGetUniqueUserQuery(user?.id)
  
  useEffect(() => {
    if (session) onAuthUser(session, dispatch, setAuthUser)
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [session, dispatch, isError, error])
  
  function toggleSidebar() {
    const dbWrapper = document.getElementById('db-wrapper')
    const show = !isToggled
    if (show) dbWrapper.classList.add('toggled')
    else dbWrapper.classList.remove('toggled')
    setIsToggled(show)
  }
  
  return token || localStorage.getItem('authToken') ? (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <div id='db-wrapper' className=''>
        <Aside/>
        
        <div id='page-content'>
          <Header toggleSidebar={toggleSidebar}/>
          <Outlet/>
        </div>
      </div>
    </ErrorBoundary>
  ) : <Navigate to='/' location={{ from: location }}/>
}

export default ProtectedLayout
