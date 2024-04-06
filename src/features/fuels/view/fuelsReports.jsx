import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {useDispatch} from "react-redux";
import {memo, useEffect, useState} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card, Tab, Tabs} from "react-bootstrap";
import FuelSupplyReportsList from "./fuelSupplyReportsList";
import FuelConsumeReportsList from "./fuelConsumeReportsList";

const tabs = [
  {title: 'Approvisionnements en carburant', event: 'supply'},
  {title: 'Consommations carburant', event: 'consumption'},
]

const FuelsReports = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'fuels' }))
  }, [dispatch])
  
  const [key, setKey] = useState('supply')
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Rapports stocks carburant'/>
      <PageLayout>
        <AppBreadcrumb title='Rapports stocks carburant'/>
        <Card>
          <Card.Body>
            <Tabs onSelect={k => setKey(k)} activeKey={key} variant='pills' className='nav-lb-tab'>
              {tabs.length > 0 && tabs.map(t =>
                <Tab key={t.event} title={t.title} eventKey={t.event}>
                  {t.event === 'supply' && <FuelSupplyReportsList/>}
                  {t.event === 'consumption' && <FuelConsumeReportsList/>}
                </Tab>)}
            </Tabs>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(FuelsReports)
