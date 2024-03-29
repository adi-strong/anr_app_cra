import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Link, useParams} from "react-router-dom";
import {Button, Card, Spinner} from "react-bootstrap";
import AgentForm from "./agentForm";
import {useGetUniqueAgentQuery} from "../model/agent.api.slice";
import toast from "react-hot-toast";

const EditAgent = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  const {id}= useParams()
  const {data, isLoading, isFetching, isError, error, refetch} = useGetUniqueAgentQuery(id)
  
  const onRefresh = async () => await refetch()
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title="Modification d'un Agent"/>
      <PageLayout>
        <AppBreadcrumb title="Modification d'un Agent"/>
        
        <div className='d-flex justify-content-between'>
          <Link to='/app/agents'><i className='bi bi-box-arrow-in-down-left'/> Retour à la liste</Link>
          
          {!isLoading &&
            <Button disabled={isFetching} variant='link' onClick={onRefresh}>
              <i className='bi bi-arrow-clockwise'/>
            </Button>}
          
          {isFetching &&
            <Button disabled variant='link' size='sm' className='p-0'>
              <Spinner animation='border' size='sm' className='text-primary p-0'/>
            </Button>}
        </div>
        
        <Card className='mt-5'>
          <Card.Body>
            <AgentForm data={data} loader={isLoading} onRefresh={onRefresh}/>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(EditAgent)
