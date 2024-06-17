import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {useDispatch} from "react-redux";
import {memo, useEffect} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import NewsTreatmentsList from "./newsTreatmentsList";

const NewsTreatments = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'dashboard' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <PageHeading title='Traitements'/>
      <PageLayout>
        <AppBreadcrumb title='Traitements' subTitle='Traitements des informations'/>
        <Card>
          <NewsTreatmentsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(NewsTreatments)
