import {useDispatch} from "react-redux";
import {memo, useEffect} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import VehicleTypesList from "./vehicleTypesList";

const VehicleTypes = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Types de véhicules'/>
      <PageLayout>
        <AppBreadcrumb title='Types de véhicules'/>
        <Card>
          <VehicleTypesList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(VehicleTypes)
