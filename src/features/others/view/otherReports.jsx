import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card, Tab, Tabs} from "react-bootstrap";
import SalaryReports from "./salaryReports";

const tabs = [
  {title: 'Rapports paiements salaires', event: 'salary'},
]

const OtherReports = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  const [key, setKey] = useState('salary')
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Autres rapports'/>
      <PageLayout>
        <AppBreadcrumb title='Rapports'/>
        <Card>
          <Card.Body>
            <Tabs onSelect={k => setKey(k)} activeKey={key} variant='pills' className='nav-lb-tab'>
              {tabs.length > 0 && tabs.map(t =>
                <Tab key={t.event} title={t.title} eventKey={t.event}>
                  {t.event === 'salary' && <SalaryReports/>}
                </Tab>)}
            </Tabs>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(OtherReports)
