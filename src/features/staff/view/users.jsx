import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import UsersList from "./usersList";
import {Card} from "react-bootstrap";

const Users = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Utilisateurs'/>
      <PageLayout>
        <AppBreadcrumb title='Utilisateurs'/>
        <Card>
          <UsersList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Users)
