import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import ExpensesReportsList from "./expensesReportsList";

const ExpensesReports = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'finances' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Rapport des dépenses'/>
      <PageLayout>
        <AppBreadcrumb title='Rapport des dépenses'/>
        <Card>
          <ExpensesReportsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ExpensesReports)
