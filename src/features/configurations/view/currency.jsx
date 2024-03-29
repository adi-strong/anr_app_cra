import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Card, Col, Row} from "react-bootstrap";
import CurrencyForm from "./currencyForm";
import {useGetUniqueCurrencyQuery} from "../model/currency.api.slice";
import {useEffect} from "react";
import toast from "react-hot-toast";

export default function Currency() {
  const {data, isLoading, isError, error, refetch} = useGetUniqueCurrencyQuery(1)
  
  useEffect(() => {
    if (isError) {
      if (isError) {
        if (error?.error) toast.error(error.error)
        if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
      }
    }
  }, [isError, error]);
  
  const onRefresh = async () => await refetch()
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageLayout>
        <Row className='mb-3'>
          <Col xl={3} lg={4} md={12}>
            <div className="mb-4 mb-lg-0">
              <h4 className="mb-1">Devise & Taux</h4>
              <p className="mb-0 fs-5 text-muted">Configuration des devises et du taux</p>
            </div>
          </Col>
          
          <Col xl={9} lg={8} md={12}>
            <Card>
              <Card.Body>
                <div className=" mb-6">
                  <h4 className="mb-1">Configuration</h4>
                </div>
                
                <CurrencyForm data={data} loader={isLoading} onRefresh={onRefresh}/>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </PageLayout>
    </ErrorBoundary>
  )
}
