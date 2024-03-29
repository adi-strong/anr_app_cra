import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {useDispatch} from "react-redux";
import {memo, useEffect} from "react";
import {onToggleMenu} from "../../config/config.slice";

const ShowProvince = () => {
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'configurations' }))
  }, [dispatch])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
    </ErrorBoundary>
  )
}

export default memo(ShowProvince)
