import {useDispatch} from "react-redux";
import {memo, useEffect} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import PropertyTypesList from "./propertyTypesList";

const PropertyTypes = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Types de propriétés'/>
      <PageLayout>
        <AppBreadcrumb title='Types de propriétés'/>
        <Card>
          <PropertyTypesList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(PropertyTypes)
