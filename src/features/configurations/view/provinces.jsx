import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, AuthorizedComponent, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import ProvincesList from "./provincesList";

const Provinces = () => {
  const dispatch = useDispatch()
  const {user: session} = useSelector((state) => state.auth)
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Provinces'/>
      <PageLayout>
        <AppBreadcrumb title='Provinces'/>
        {session && session?.roles && session.roles.length > 0 && (
          <AuthorizedComponent userRoles={session.roles} allowedRoles={['ROLE_AG', 'ROLE_SUPER_ADMIN']}>
            <Card>
              <ProvincesList/>
            </Card>
          </AuthorizedComponent>
        )}
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Provinces)
