import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";

const Refueling = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'fuels' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Ravitaillement véhicule'/>
      <PageLayout>
        <AppBreadcrumb title='Ravitaillement véhicule'/>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Refueling)
