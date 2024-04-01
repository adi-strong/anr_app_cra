import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import FuelStocksList from "./fuelStocksList";

const FuelStocks = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'fuels' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Agents'/>
      <PageLayout>
        <AppBreadcrumb title='Carburants'/>
        <FuelStocksList/>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(FuelStocks)
