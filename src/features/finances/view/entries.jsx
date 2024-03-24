import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import EntriesList from "./entriesList";
import {Card} from "react-bootstrap";

const Entries = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'finances' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Entrées'/>
      <PageLayout>
        <AppBreadcrumb title='Entrées'/>
        <Card>
          <EntriesList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Entries)
