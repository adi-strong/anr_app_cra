import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import ImageUploading from 'react-images-uploading';
import avatar from '../../../assets/images/avatar/default_profile.jpg';
import {Button} from "react-bootstrap";

export default function AddPatientImageField({images, onChange, loader = false}) {
  const maxNumber = 1
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <img
        src={images && images.length > 0 ? images[0]['data_url'] : avatar}
        width={130}
        height={150}
        className='mt-6'
        alt=''
      />
      <div className="App">
        <ImageUploading
          multiple
          value={images}
          onChange={onChange}
          maxNumber={maxNumber}
          dataURLKey="data_url"
        >
          {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
            // write your building UI
            <div className="upload__image-wrapper mt-2 mx-6">
              {images?.length < 1 &&
                <Button
                  disabled={loader}
                  type='button'
                  style={isDragging ? { color: 'red' } : undefined}
                  size='sm'
                  variant='info'
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  <i className='bi bi-upload'/>
                </Button>}
              &nbsp;
              <Button
                style={images?.length > 0 ? { position: 'relative', left: 31 } : {}}
                disabled={loader}
                size='sm'
                type='button'
                variant='danger'
                onClick={onImageRemoveAll}><i className='bi bi-trash'/></Button>
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <div className="image-item__btn-wrapper">
                    <Button
                      style={{ position: 'relative', bottom: 29 }}
                      type='button'
                      variant='info'
                      size='sm'
                      onClick={() => onImageUpdate(index)}><i className='bi bi-upload'/></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ImageUploading>
      </div>
    </ErrorBoundary>
  )
}
