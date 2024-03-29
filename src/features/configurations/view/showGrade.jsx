import {useDispatch} from "react-redux";
import {memo, useEffect, useState} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, AppOffCanvas, FallBackRender, PageHeading, RemoveModal} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Card, Col, Form, Row, Spinner, Table} from "react-bootstrap";
import {
  useDeleteGradeMutation,
  useGetUniqueGradeQuery
} from "../model/department.api.slice";
import toast from "react-hot-toast";
import {agentItems} from "../../staff/model/agent.service";
import GradeAgentItem from "./gradeAgentItem";
import {FadeSpinLoader} from "../../../loaders";
import EditGradeForm from "./editGradeForm";

const ShowGrade = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  const {id} = useParams()
  const {data, isLoading, isFetching, isError, error, refetch} = useGetUniqueGradeQuery(id)
  
  const onRefresh = async () => await refetch()
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  const [deleteGrade, {isLoading: isDelLoad}] = useDeleteGradeMutation()
  const [search, setSearch] = useState('')
  
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  const onDelete = async (data) => {
    toggleOpen()
    try {
      const send = await deleteGrade(data)
      if (send?.data) {
        navigate(`/app/departments/${data?.department?.id}/${data?.department?.slug}`, {replace: true})
      }
    }
    catch (e) { toast.error('Problème de connexion.')}
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Grade'/>
      <PageLayout>
        <AppBreadcrumb title={`Grade`}/>
        
        <div className='d-flex justify-content-between'>
          {!(isError && isLoading) && data &&
            <Link to={`/app/departments/${data?.department?.id}/${data?.department?.slug}`}>
              <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
            </Link>}
          
          <Button variant='link' disabled={isFetching} onClick={onRefresh}>
            {isFetching && <Spinner animation='grow' size='sm' className='text-primary me-1'/>}
            {!isFetching && <i className='bi bi-arrow-clockwise text-primary me-1'/>}
            Actualiser
          </Button>
        </div>
        
        <Card>
          <Card.Header>
            {!(isError && isLoading) && data &&
              <Row className='pt-4'>
                <Col md={8}>
                  <h3 className='card-title text-uppercase fw-bold'>
                    {data?.name}
                  </h3>
                  <div>
                    <Button disabled={isDelLoad} variant='danger' className='me-1' onClick={toggleOpen}>
                      <i className='bi bi-trash'/> Supprimer
                    </Button>
                    
                    <Button disabled={isDelLoad} onClick={toggleShow}>
                      <i className='bi bi-pencil-square'/> Modifier
                    </Button>
                  </div>
                </Col>
              </Row>} <hr/>
            
            {!(isError && isLoading) && data &&
              <Row>
                <Col md={8} className='mb-2'>
                  <Button variant='info' className='text-light' disabled={false}>
                    <i className='bi bi-printer'/> Imprimer
                  </Button>
                </Col>
                
                <Col md={4} className='mb-2'>
                  <Form.Control
                    disabled={false}
                    autoComplete='off'
                    name='search'
                    value={search}
                    onChange={({target}) => setSearch(target.value)}
                    placeholder='Recherche...'/>
                </Col>
              </Row>}
          </Card.Header>
          
          <div>
            <Table className='text-nowrap'>
              <thead className='table-light'>
              <tr>
                {agentItems.map(t =>
                  <th key={t.label} className='align-middle'>
                    {t.label}
                  </th>)}
                <th className='text-end text-primary'>
                  <i className='bi bi-arrow-clockwise' style={{ cursor: 'pointer' }}/>
                </th>
              </tr>
              </thead>
              
              <tbody>
              <GradeAgentItem/>
              </tbody>
            </Table>
            {isLoading && <FadeSpinLoader loading={isLoading}/>}
          </div>
        </Card>
      </PageLayout>
      
      {!(isError && isLoading) && data &&
        <AppOffCanvas
          children={<EditGradeForm
            data={data}
            onRefresh={onRefresh}
            onHide={toggleShow}/>}
          title={<><i className='bi bi-pencil-square'/> Modification du grade</>}
          show={show}
          onHide={toggleShow}/>}
      
      {!(isError && isLoading) && data &&
        <RemoveModal
          data={data}
          onRemove={() => onDelete(data)}
          message={`Ce grade (${data?.name?.toUpperCase()})`}
          show={open}
          onHide={toggleOpen}
          onRefresh={onRefresh}/>}
    </ErrorBoundary>
  )
}

export default memo(ShowGrade)
