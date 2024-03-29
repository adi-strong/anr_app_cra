import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import ProvincesList from "./provincesList";

const Provinces = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Provinces'/>
      <PageLayout>
        <AppBreadcrumb title='Provinces'/>
        <Card>
          <ProvincesList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Provinces)
