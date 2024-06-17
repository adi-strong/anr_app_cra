import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {useEffect, useState} from "react";
import {Button, Card, Col, Form, Row, Table} from "react-bootstrap";
import {newsTreatTHItems} from "../services/news.treatment.conf.service";
import {useGetDepartmentNewsQuery} from "../services/news.treatment.api.slice";
import toast from "react-hot-toast";
import {RepeatableTableRowsLoader} from "../../../loaders";
import NewsTreatmentItem from "./newsTreatmentItem";

export default function NewsTreatmentsList() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const {data: news=[], isLoading, isFetching, isError, error, refetch} = useGetDepartmentNewsQuery()
  
  const onRefresh = async (): void => { await refetch() }
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) {
        toast.error(error.data['hydra:description'])
      }
    }
  }, [isError, error])
  
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <Card.Header className='bg-white pt-8'>
        <Row className='mb-3'>
          <Col md={7} className='mb-2'>
            <Button disabled={isFetching} onClick={onRefresh}>
              <i className='bi bi-arrow-clockwise me-1'/>
              {isFetching ? 'Veuillez patienter' : 'Actualiser'}
            </Button>
          </Col>
          
          <Col md={5} className='mb-2'>
            <Form.Control
              disabled={isLoading}
              placeholder='Recherche...'
              value={search}
              onChange={({target}) => setSearch(target.value)}
            />
          </Col>
        </Row>
      </Card.Header>
      
      <div>
        <Table className='text-nowrap'>
          <thead className='table-light'>
          <tr>
            {newsTreatTHItems.length > 0 && newsTreatTHItems.map((t, index) =>
              <th key={t.label} className='align-middle'>{t.label}</th>)}
            <th className='align-middle'/>
          </tr>
          </thead>
          
          <tbody>
          {!(isError && isLoading) && news.length > 0 && news.map((n, index) =>
            <NewsTreatmentItem key={index} data={n}/>)}
          </tbody>
        </Table>
        
        {isLoading && <RepeatableTableRowsLoader/>}
      </div>
    </ErrorBoundary>
)
}
