import {useDispatch, useSelector} from "react-redux";
import {memo, useEffect} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, AuthorizedComponent, FallBackRender, PageHeading} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import SocietyTypesList from "./societyTypesList";

const SocietyTypes = () => {
  const dispatch = useDispatch()
  const {user: session} = useSelector((state) => state.auth)
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title="Types d'activités des sociétés"/>
      <PageLayout>
        <AppBreadcrumb title="Types d'activités des sociétés"/>
        {session && session?.roles && session.roles.length > 0 && (
          <AuthorizedComponent userRoles={session.roles} allowedRoles={['ROLE_AG', 'ROLE_SUPER_ADMIN']}>
            <Card>
              <SocietyTypesList/>
            </Card>
          </AuthorizedComponent>
        )}
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(SocietyTypes)
