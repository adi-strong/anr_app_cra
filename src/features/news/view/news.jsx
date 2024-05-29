import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card, Tab, Tabs} from "react-bootstrap";
import NewsList from "./newsList";
import NewsReportsList from "./newsReportsList";

const tabs = [
  {title: 'Historique', event: 'historic'},
  {title: 'Rapport(s)', event: 'reports'},
]

const News = () => {
  const dispatch = useDispatch()
  const [key, setKey] = useState('historic')
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'dashboard' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <PageHeading title='Informations'/>
      <PageLayout>
        <AppBreadcrumb title='Informations'/>
        <Card>
          <Card.Body>
            <Tabs
              onSelect={k => setKey(k)}
              activeKey={key}
              variant='pills'
              className='nav-lb-tab'>
              {tabs.length > 0 && tabs.map((t, i) =>
                <Tab key={t.event} title={t.title} eventKey={t.event}>
                  {t.event === 'historic' && <NewsList/>}
                  {t.event === 'reports' && <NewsReportsList/>}
                </Tab>)}
            </Tabs>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(News)
