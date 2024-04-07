import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import SalaryPaymentForm from "./salaryPaymentForm";

const SalaryByGroup = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Paiement salaire en groupe'/>
      <PageLayout>
        <AppBreadcrumb title='Paiement salaire en groupe'/>
        <SalaryPaymentForm/>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(SalaryByGroup)
