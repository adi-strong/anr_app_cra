import {useDispatch} from "react-redux";
import {memo, useEffect, useState} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, AppOffCanvas, FallBackRender, PageHeading, RemoveModal} from "../../../components";
import {PageLayout} from "../../../layouts";
import {Breadcrumb, Button, Card, Col, Row, Spinner} from "react-bootstrap";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDeleteDepartmentMutation, useGetUniqueDepartmentQuery} from "../model/department.api.slice";
import {FadeSpinLoader} from "../../../loaders";
import ServicesList from "./servicesList";
import toast from "react-hot-toast";
import SubDepList from "./subDepList";
import EditDepartmentForm from "./editDepartmentForm";
import GradesList from "./gradesList";

const ShowDepartment = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  const {id} = useParams()
  const {data, isLoading, isFetching, isError, error, refetch} = useGetUniqueDepartmentQuery(id)
  
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
  const [deleteDepartment, {isLoading: isDelLoad}] = useDeleteDepartmentMutation()
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  const onDelete = async (data) => {
    toggleOpen()
    try {
      const send = await deleteDepartment(data)
      if (send?.data) { navigate('/app/departments', {replace: true}) }
    }
    catch (e) { toast.error('Problème de connexion.')}
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Département'/>
      <PageLayout>
        <AppBreadcrumb title={
          <span className='text-capitalize'>
            <i className='bi bi-house-check'/> DÉPARTEMENT : {!isError && data && data?.name ? data.name : ''}
          </span>}/>
        
        <div className='d-flex justify-content-between'>
          <Link to='/app/departments'>
            <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
          </Link>
          
          <Button variant='link' disabled={isFetching} onClick={onRefresh}>
            {isFetching && <Spinner animation='grow' size='sm' className='text-primary me-1'/>}
            {!isFetching && <i className='bi bi-arrow-clockwise text-primary me-1'/>}
            Actualiser
          </Button>
        </div>
        
        {!(isError && isLoading) && data && data?.paths && data.paths?.length > 0 && (
          <>
            <Card.Title><i className='bi bi-house-fill'/> Sous-département de :</Card.Title>
            <Breadcrumb>
              <i className='bi bi-house me-1 text-primary'/>
              {data.paths.map(p =>
                <Link
                  key={p.id} to={`/app/departments/${p.id}/${p?.slug}`}
                  className='breadcrumb-item text-capitalize'>{p.name}</Link>)}
            </Breadcrumb>
          </>
        )}
        
        <Card className='mt-3'>
          <Card.Body>
            {!(isError && isLoading) && data &&
              <Row className='pt-4'>
                <Col md={8} className='mb-3'>
                  <h3 className='card-title text-uppercase fw-bold'>
                    <i className='bi bi-house-fill'/> {data?.name}
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
                <Col md={4} className='mb-3'>
                  <Card.Title>
                    <i className='bi bi-server'/> TOTAL SERVICES : {data?.nbServices}
                  </Card.Title>
                  
                  <Card.Title>
                    <i className='bi bi-people-fill'/> TOTAL AGENTS : 0
                  </Card.Title>
                </Col>
              </Row>}
            {isLoading && <FadeSpinLoader loading={isLoading}/>}
          </Card.Body>
        </Card>
        
        {!(isError && isLoading) && data && (
          <>
            <ServicesList department={data} services={data?.services} onRefresh={onRefresh}/>
            <SubDepList departments={data?.deps} onRefresh={onRefresh} department={data}/>
            <GradesList grades={data?.depGrades} onRefresh={onRefresh} department={data}/>
          </>
        )}
      </PageLayout>
      
      <AppOffCanvas
        children={<EditDepartmentForm
          data={data}
          onRefresh={onRefresh}
          onHide={toggleShow}/>}
        title={<><i className='bi bi-pencil-square'/> Modification du département</>}
        show={show}
        onHide={toggleShow}/>
      
      {data &&
        <RemoveModal
          data={data}
          onRemove={() => onDelete(data)}
          message={`Ce département (${data?.name?.toUpperCase()})`}
          show={open}
          onHide={toggleOpen}
          onRefresh={onRefresh}/>}
    </ErrorBoundary>
  )
}

export default memo(ShowDepartment)
