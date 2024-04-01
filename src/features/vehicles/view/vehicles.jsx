import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import VehiclesList from "./vehiclesList";

const Vehicles = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'patrimony' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Patrimoines roulants'/>
      <PageLayout>
        <AppBreadcrumb title='Patrimoines roulants'/>
        <Card>
          <VehiclesList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Vehicles)
