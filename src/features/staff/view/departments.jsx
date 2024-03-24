import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import DepartmentsList from "./departmentsList";

const Departments = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Départements'/>
      <PageLayout>
        <AppBreadcrumb title='Départements'/>
        <Card>
          <DepartmentsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Departments)
