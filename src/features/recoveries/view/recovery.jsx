import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import RecoveryForm from "./recoveryForm";

const Recovery = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'recovery' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Contrôle sécuritaire / Recouvrement'/>
      <PageLayout>
        <AppBreadcrumb title='Contrôle sécuritaire / Recouvrement'/>
        <RecoveryForm/>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Recovery)
