import {useDispatch} from "react-redux";
import {memo, useEffect} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import SocietyTypesList from "./societyTypesList";

const SocietyTypes = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title="Types d'activités des sociétés"/>
      <PageLayout>
        <AppBreadcrumb title="Types d'activités des sociétés"/>
        <Card>
          <SocietyTypesList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(SocietyTypes)
