import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import NursingList from "./nursingList";
import {Card} from "react-bootstrap";
import {PageLayout} from "../../../layouts";

const Nursing = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'consultations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='nursing'/>
      <PageLayout>
        <AppBreadcrumb title='Nursing'/>
        <Card>
          <NursingList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Nursing)
