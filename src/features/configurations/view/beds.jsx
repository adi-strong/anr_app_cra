import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card, Tab, Tabs} from "react-bootstrap";
import BedsList from "./bedsList";
import BedroomsList from "./bedroomsList";

const tabs = [ {title: 'Lits', event: 'beds'}, {title: 'Chambres', event: 'bedrooms'} ]

const Beds = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  const [key, setKey] = useState('beds')
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title="Lits d'hospitalisation"/>
      <PageLayout>
        <AppBreadcrumb title="Lits d'hospitalisation"/>
        <Card>
          <Tabs activeKey={key} variant='pills' onSelect={k => setKey(k)} className='p-3 pt-5'>
            {tabs.length > 0 && tabs.map(t =>
              <Tab key={t.event} title={t.title} eventKey={t.event}/>)}
          </Tabs>
          {key === 'beds' && <BedsList/>}
          {key === 'bedrooms' && <BedroomsList/>}
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Beds)
