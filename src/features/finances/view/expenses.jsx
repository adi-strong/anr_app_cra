import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {Card} from "react-bootstrap";
import ExpensesList from "./expensesList";
import {PageLayout} from "../../../layouts";
import ExpenseCategoriesList from "./expenseCategoriesList";

const Expenses = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'finances' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Dépenses'/>
      <PageLayout>
        <AppBreadcrumb title='Dépenses'/>
        <Card>
          <ExpensesList/>
        </Card>
        
        <Card className='mt-8'>
          <ExpenseCategoriesList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Expenses)
