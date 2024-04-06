import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, FieldsAlert, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Card} from "react-bootstrap";
import RefuelingForm from "./refuelingForm";

const Refueling = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'fuels' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Ravitaillement véhicule'/>
      <PageLayout>
        <AppBreadcrumb title='Ravitaillement véhicule'/>
        
        <FieldsAlert/>
        <Card>
          <Card.Body>
            <h4 className='card-title'>Formulaire de ravitaillement en carburant</h4>
            <RefuelingForm/>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(Refueling)
