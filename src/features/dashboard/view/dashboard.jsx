import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {Container, Row} from "react-bootstrap";
import AgentsSection from "./sections/AgentsSection";
import ExpensesSection from "./sections/ExpensesSection";
import AccountstSection from "./sections/AccountstSection";
import MissionsSection from "./sections/MissionsSection";
import SynthesisSection from "./sections/SynthesisSection";
import FinanceSection from "./sections/FinanceSection";
import LastUserSection from "./sections/LastUserSection";

const Dashboard = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'dashboard' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Tableau de bord'/>
      
      <div className='bg-primary pt-10 pb-21'/>
      <Container fluid className='mt-n22 px-6'>
        <Row className='my-6'>
          <div className="col-lg-12 col-md-12 col-12">
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="mb-2 mb-lg-0">
                  <h3 className="mb-0  text-white">Tableau de bord</h3>
                </div>
              </div>
            </div>
          </div>
          
          <AgentsSection/>
          <AccountstSection/>
          <MissionsSection/>
          <ExpensesSection/>
        </Row>
        
        <Row className='mt-5'>
          <SynthesisSection/>
          <FinanceSection/>
          <LastUserSection/>
        </Row>
      </Container>
    </ErrorBoundary>
  )
}

export default memo(Dashboard)
