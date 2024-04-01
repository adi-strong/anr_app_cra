import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading} from "../../../components";
import {useDispatch} from "react-redux";
import {memo, useEffect} from "react";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import PropertyForm from "./propertyForm";
import {useGetUniquePropertyQuery} from "../model/property.api.slice";
import {useParams} from "react-router-dom";
import toast from "react-hot-toast";

const EditProperty = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'patrimony' }))
  }, [dispatch])
  
  const {id} = useParams()
  const {data, isLoading, isError, error} = useGetUniquePropertyQuery(id)
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Modification de la propriété'/>
      <PageLayout>
        <AppBreadcrumb title='Modification de la propriété'/>
        <PropertyForm data={data} loader={isLoading}/>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(EditProperty)
