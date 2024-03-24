import {useDispatch} from "react-redux";
import {memo, useEffect} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import ExamsList from "./examsList";

const Exams = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Examens'/>
      <PageLayout>
        <AppBreadcrumb title='Examens'/>
        <Card>
          <ExamsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Exams)
