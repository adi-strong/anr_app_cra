import {ErrorBoundary} from "react-error-boundary";
import {memo, useEffect} from "react";
import {useDispatch} from "react-redux";
import {onResetConfig} from "../../config/config.slice";
import {FallBackRender, PageHeading} from "../../../components";

const Help = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onResetConfig())
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title='Aide'/>
    </ErrorBoundary>
  )
}

export default memo(Help)
