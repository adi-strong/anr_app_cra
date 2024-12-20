import {ErrorBoundary} from "react-error-boundary";
import {AuthorizedComponent, FallBackRender} from "../../../components";
import {useDispatch, useSelector} from "react-redux";
import {memo, useEffect} from "react";
import {onToggleMenu} from "../../config/config.slice";

const ShowProvince = () => {
  const dispatch = useDispatch()
  const {user: session} = useSelector((state) => state.auth)
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      {session && session?.roles && session.roles.length > 0 && (
        <AuthorizedComponent userRoles={session.roles} allowedRoles={['ROLE_AG', 'ROLE_SUPER_ADMIN']}>
        </AuthorizedComponent>
      )}
    </ErrorBoundary>
  )
}

export default memo(ShowProvince)
