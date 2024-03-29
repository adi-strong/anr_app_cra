import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import YearsList from "./yearsList";
import Currency from "./currency";

const Configs = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Configuarations générales'/>
      <PageLayout>
        <AppBreadcrumb title='Configuarations générales'/>
        <Currency/>
        
        <Card className='mt-5'>
          <YearsList/>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Configs)
