import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import AssignmentsList from "./assignmentsList";

const Assignments = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Affectations'/>
      <PageLayout>
        <Card>
          <AssignmentsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Assignments)
