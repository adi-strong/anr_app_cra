import {ErrorBoundary} from "react-error-boundary";
import {AuthorizedComponent, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import AssignmentsList from "./assignmentsList";

const Assignments = () => {
  const dispatch = useDispatch()
  const {user: session} = useSelector((state) => state.auth)
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Affectations'/>
      <PageLayout>
        {session && session?.roles && session.roles.length > 0 && (
          <AuthorizedComponent userRoles={session.roles} allowedRoles={['ROLE_AG', 'ROLE_SUPER_ADMIN']}>
            <Card>
              <AssignmentsList/>
            </Card>
          </AuthorizedComponent>
        )}
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Assignments)
