import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import FolderTypesList from "./folderTypesList";

const FoldersTypes = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Types de dossiers agents'/>
      <PageLayout>
        <AppBreadcrumb title='Types de dossiers agents'/>
        <Card>
          <FolderTypesList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(FoldersTypes)
