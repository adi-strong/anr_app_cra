import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import SalariesList from "./salariesList";

const Salaries = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Salaires'/>
      <PageLayout>
        <Card>
          <SalariesList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Salaries)
