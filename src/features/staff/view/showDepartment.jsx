import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Link, useParams} from "react-router-dom";
import {Card} from "react-bootstrap";

const ShowDepartment = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  const {id} = useParams()
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Nursing'/>
      <PageLayout>
        <AppBreadcrumb title={`Département ${id}`}/>
        <Link to='/app/departments'>
          <i className='bi bi-box-arrow-in-down-left'/> Retour à la liste
        </Link>
        
        <Card className='mt-5'>
          <Card.Body>
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ShowDepartment)
