import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import CovenantsList from "./CovenantsList";
import {Card} from "react-bootstrap";

const Covenants = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'patients' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Conventions'/>
      <PageLayout>
        <AppBreadcrumb title='Conventions / Sociétés'/>
        <Card>
          <CovenantsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Covenants)
