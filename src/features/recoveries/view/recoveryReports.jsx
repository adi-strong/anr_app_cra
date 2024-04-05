import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import RecoveryReportsList from "./recoveryReportsList";

const RecoveryReports = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'recovery' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Rapports recouvrement'/>
      <PageLayout>
        <AppBreadcrumb title='Rapports recouvrement'/>
        <Card>
          <RecoveryReportsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(RecoveryReports)
