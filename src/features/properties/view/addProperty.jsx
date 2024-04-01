import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {PageLayout} from "../../../layouts";
import {useDispatch} from "react-redux";
import {memo, useEffect} from "react";
import {onToggleMenu} from "../../config/config.slice";
import PropertyForm from "./propertyForm";

const AddProperty = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'patrimony' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Enregistrer une propriété'/>
      <PageLayout>
        <AppBreadcrumb title='Enregistrer une propriété'/>
        <PropertyForm/>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(AddProperty)
