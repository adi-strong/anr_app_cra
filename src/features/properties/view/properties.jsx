import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import PropertiesList from "./propertiesList";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";

const Properties = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'patrimony' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Propriétés'/>
      <PageLayout>
        <AppBreadcrumb title='Propriétés'/>
        <Card>
          <PropertiesList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Properties)
