import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import Webcam from "react-webcam";
import {Button} from "react-bootstrap";

export default function NewsPicturesComponent(
  {
    isChecked,
    webCamRef,
    facingMode,
    switchCamera,
    onCapture,
    recording,
    onStopRecording,
    onStartRecording
  }) {
  return (
    <ErrorBoundary fallback={FallBackRender}>
      {!isChecked &&
        <div className='mb-3'>
          <Webcam
            audio={true}
            ref={webCamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{facingMode}}
            className='w-100'
            style={{height: 'auto'}}
          />
          <Button
            variant='secondary'
            className='me-2 mb-2'
            onClick={switchCamera}
          >
            <i className='bi bi-arrow-repeat'/> Switcher
          </Button>
          
          <Button
            variant='info'
            className='mb-2 me-2 text-white'
            onClick={onCapture}>
            <i className='bi bi-camera'/> Prendre une Photo
          </Button>
          
          <Button
            variant='light'
            className='mb-2 me-2'
            onClick={recording ? onStopRecording : onStartRecording}>
            <i className={`me-1 bi bi-${recording ? 'vinyl' : 'vinyl-fill'} text-danger`}/>
            {recording ? 'Arrêter' : 'Enregistrement vidéo'}</Button>
        </div>}
    </ErrorBoundary>
  )
}
