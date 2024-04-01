import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import SocietiesList from "./societiesList";

const Societies = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'recovery' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Sociétés'/>
      <PageLayout>
        <AppBreadcrumb title='Sociétés'/>
        <Card>
          <SocietiesList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Societies)
