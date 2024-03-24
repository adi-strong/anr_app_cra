import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import ActsList from "./actsList";

const Acts = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Actes médicaux'/>
      <PageLayout>
        <AppBreadcrumb title='Actes Médicaux'/>
        <Card>
          <ActsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Acts)
