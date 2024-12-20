import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, AuthorizedComponent, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import RecoveryReportsList from "./recoveryReportsList";

const RecoveryReports = () => {
  const dispatch = useDispatch()
  const {user: session} = useSelector((state) => state.auth)
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'recovery' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Rapports recouvrement'/>
      <PageLayout>
        <AppBreadcrumb title='Rapports recouvrement'/>
        {session && session?.roles && session.roles.length > 0 && (
          <AuthorizedComponent userRoles={session.roles} allowedRoles={['ROLE_AG', 'ROLE_SUPER_ADMIN']}>
            <Card>
              <RecoveryReportsList/>
            </Card>
          </AuthorizedComponent>
        )}
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(RecoveryReports)
