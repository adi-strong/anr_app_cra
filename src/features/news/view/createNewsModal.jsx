import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, FeedbackError, QuillEditor} from "../../../components";
import PropTypes from "prop-types";
import {Button, Col, Form, Modal, Row, Spinner, Tab, Tabs} from "react-bootstrap";
import toast from "react-hot-toast";
import {useEffect, useRef, useState} from "react";
import {newsErrors, newsFields, newsPriorityOptions, newsSortOptions} from "../services/news.conf.service";
import {onFieldChange} from "../../../services/form.handler.service";
import {useCreateNewsMutation} from "../services/news.api.slice";
import ImageUploading from 'react-images-uploading';
import NewsPicturesComponent from "./newsPicturesComponent";
import NewsFilesComponent from "./newsFilesComponent";

const tabs = [
  {title: 'Photos & Vidéos', event: 'pictures'},
  {title: 'Documents', event: 'documents'},
]

export default function CreateNewsModal({ show, onHide }) {
  const maxNumber = 69
  const mediaRecorderRef = useRef(null)
  const [files, setFiles] = useState([])
  const [videoURL, setVideoURL] = useState(null)
  const [key, setKey] = useState('pictures')
  const [isChecked, setIsChecked] = useState(false)
  const [confirm, setConfirm] = useState(false);
  const [recording, setRecording] = useState(false)
  const [fields, setFields] = useState(newsFields)
  const [errors, setErrors] = useState(newsErrors)
  const [draft, setDraft] = useState('')
  const [createNewsMutation, {isLoading, isError, error}] = useCreateNewsMutation()
  
  const webcamRef = useRef(null)
  const [facingMode, setFacingMode] = useState('user')
  
  const dataURLtoFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }
  
  const onCapture = (): void => {
    const imageSrc = webcamRef.current.getScreenshot()
    const file = dataURLtoFile(imageSrc, 'captured_image.jpg')
    setFields({
      ...fields,
      pictures: [...fields.pictures, {type: 'photo', data_url: imageSrc, file }]
    })
  }
  
  const switchCamera = (): void => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  }
  
  const handleDataAvailable = (event) => {
    if (event.data && event.data.size > 0) {
      const videoBlob = new Blob([event.data], { type: 'video/webm' });
      const videoURL = URL.createObjectURL(videoBlob);
      setVideoURL(videoURL);
      setFields({
        ...fields,
        pictures: [...fields.pictures, {type: 'video', data_url: videoURL, file: videoBlob}]
      })
    }
  }
  
  const onStartRecording = () => {
    if (webcamRef.current && webcamRef.current.stream) {
      setRecording(true);
      mediaRecorderRef.current = new MediaRecorder(
        webcamRef.current.stream,
        { mimeType: 'video/webm' }
      )
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
    }
  }
  
  const onStopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  }
  
  
  // ---------------------------------------------------------------------------
  
  
  const onFileChange = (e, index) => {
    const value = e.target.files[0]
    const values = [...files]
    values[index].file = value
    setFiles(values)
  }
  
  const onAddFileItem = () => {
    setFiles([...files, {file: ''}])
  }
  
  const onRemoveFileItem = (index) => {
    const values = [...files]
    values.splice(index, 1)
    setFiles(values)
  }
  
  
  // ---------------------------------------------------------------------------
  
  
  const onBlur = () => setFields({...fields, content: draft})
  
  const onContentChange = content => {
    setDraft(content)
    setFields({...fields, content})
  }
  
  const toggleConfirm = () => setConfirm(!confirm);
  
  const onReset = (): void => {
    setErrors(newsErrors)
    setFields(newsFields)
  }
  
  const onAbort = (): void => {
    setConfirm(false);
    onReset()
    onHide()
  }
  
  const onPictureChange = (imageList, updateIndex): void => {
    const images = imageList?.length > 0 ? imageList.map(img => ({
      data_url: img?.data_url,
      file: img?.file,
      type: 'photo'
    })) : []
    setFields({...fields, pictures: images})
  }
  
  const blobToFile = (blob, fileName): File => {
    return new File([blob], fileName, { type: blob.type, lastModified: Date.now() });
  };
  
  const onSubmit = async () => {
    toggleConfirm()
    const formData = new FormData()
    let items = []
    if (files.length > 0) {
      files.forEach(f => {
        items.push({file: f.file})
      })
    }
    if (fields.pictures.length > 0) {
      fields.pictures.forEach(p => {
        items.push({file: p.file})
      })
    }
    
    formData.append('title', fields.title)
    formData.append('sort', fields.sort)
    formData.append('subTitle', fields.subTitle)
    formData.append('content', fields.content)
    formData.append('priority', fields.priority)
    if (fields.address) formData.append('address', fields.address)
    if (items.length > 0) {
      items.forEach((picture, index) => {
        if (picture.type === 'video') {
          // Vérifier et définir un nom de fichier valide
          const fileName = picture.file.name || `video_${Date.now()}.webm`;
          const file = blobToFile(picture.file, fileName);
          formData.append(`pictures[${index}]`, file);
        }
        else {
          formData.append(`pictures[${index}]`, picture.file);
        }
      })
    }
    
    try {
      const send = await createNewsMutation(formData)
      if (send?.data) {
        toast.success('Information(s) transmise(s).')
        setConfirm(false);
        setErrors(newsErrors)
        setFields(newsFields)
        setFiles([])
        onHide()
      }
    } catch (e) { toast.error('Problème de connexion.') }
  }
  
  // ********************************************************************************
  
  useEffect(() => {
    if (isError) {
      const {violations} = error?.data
      if (violations) violations.forEach(({ propertyPath, message }) => {
        setErrors(s => ({...s, [propertyPath]: message }))
      })
    }
  }, [isError, error])
  
  return (
    <ErrorBoundary fallback={FallBackRender}>
      <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header closeButton className='bg-warning'>
          <Modal.Title>
            <i className='bi bi-file-earmark-plus'/> Information à transmettre
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Tabs
            onSelect={k => setKey(k)}
            activeKey={key}
            variant='pills'
            className='nav-lt-tab px-4'>
            {tabs.length > 0 && tabs.map((p, i) =>
              <Tab key={i} title={p.title} eventKey={p.event}>
                {p.event === 'pictures' && (
                  <>
                    <NewsPicturesComponent
                      facingMode={facingMode}
                      isChecked={isChecked}
                      onCapture={onCapture}
                      switchCamera={switchCamera}
                      webCamRef={webcamRef}
                      recording={recording}
                      onStopRecording={onStopRecording}
                      onStartRecording={onStartRecording}
                      videoURL={videoURL}
                    />
                    
                    <Form.Switch
                      disabled={isLoading}
                      id='isChecked'
                      label={isChecked
                        ? <><i className='bi bi-image-alt'/> Prendre une capture</>
                        : <><i className='bi bi-download'/> Importer</>}
                      onChange={() => setIsChecked(!isChecked)}
                      value={isChecked}
                      checked={isChecked}
                    />
                  </>
                )}
                
                {p.event === 'documents' && (
                  <NewsFilesComponent
                    files={files}
                    loader={isLoading}
                    onFileChange={onFileChange}
                    onAddFileItem={onAddFileItem}
                    onRemoveFileItem={onRemoveFileItem}
                  />
                )}
              </Tab>)}
          </Tabs>
          
          <ImageUploading
            multiple
            value={fields.pictures}
            onChange={onPictureChange}
            maxNumber={maxNumber}
            dataURLKey='data_url'>
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
              <div className='upload__image-wrapper'>
                <div className='text-center'>
                  {isChecked &&
                    <Button
                      variant='info'
                      className='p-5 w-100 mt-2'
                      style={isDragging ? {color: 'red'} : undefined}
                      onClick={onImageUpload}
                      {...dragProps}
                    >
                      <i className='bi bi-download'/> Importer une image
                    </Button>}
                  
                  {fields.pictures.length > 0 &&
                    <Button
                      variant='danger'
                      className='p-5 w-100 mt-2'
                      onClick={onImageRemoveAll}>
                      <i className='bi bi-trash'/> Supprimer toutes les images
                    </Button>}
                </div>
                
                {fields.pictures.length > 0 &&
                  <Row className='mt-3 bg-light pt-3 pe-1 pb-3 px-1 mx-2 me-2'>
                    {imageList.map((image, index) => (
                      <Col key={index} md={3} className='image-item mb-3'>
                        {image.type === 'photo' ? (
                          <>
                            <img src={image['data_url']} alt='' className='w-100' height={120}/>
                            <div className='image-item__btn-wrapper'>
                              <Button
                                className='w-50 text-light'
                                variant='info'
                                style={{borderRadius: 0}}
                                onClick={() => onImageUpdate(index)}>
                                <i className='bi bi-pencil-square'/>
                              </Button>
                              
                              <Button
                                className='w-50'
                                variant='danger'
                                style={{borderRadius: 0}}
                                onClick={() => onImageRemove(index)}>
                                <i className='bi bi-trash'/>
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <video
                              src={image.data_url}
                              style={{width: 161.62, height: 112 }}
                              className='mb-0'
                              controls
                            />
                            <div className='image-item__btn-wrapper'>
                              <Button
                                className='w-50 text-light'
                                variant='info'
                                style={{borderRadius: 0}}
                                onClick={() => onImageUpdate(index)}>
                                <i className='bi bi-pencil-square'/>
                              </Button>
                              
                              <Button
                                className='w-50'
                                variant='danger'
                                style={{borderRadius: 0}}
                                onClick={() => onImageRemove(index)}>
                                <i className='bi bi-trash'/>
                              </Button>
                            </div>
                          </>
                        )}
                      </Col>
                    ))}
                  </Row>}
              </div>
            )}
          </ImageUploading>
          
          <hr/>
          <Row>
            <Col className='mb-3'>
              <Form.Label htmlFor='title'>Titre</Form.Label>
              <Form.Control
                disabled={isLoading}
                isInvalid={errors.title !== null}
                autoComplete='off'
                id='title'
                name='title'
                value={fields.title}
                onChange={e => onFieldChange(e, fields, setFields)}/>
              <FeedbackError error={errors.title}/>
            </Col>
            
            <Col className='mb-3'>
              <Form.Label htmlFor='sort'>Classification</Form.Label>
              <Form.Select
                disabled={isLoading}
                isInvalid={errors.sort !== null}
                id='sort'
                name='sort'
                value={fields.sort}
                onChange={e => onFieldChange(e, fields, setFields)}>
                {newsSortOptions.length > 0 && newsSortOptions
                  .map((p, i) =>
                    <option key={i} value={p.value}>{p.label}</option>
                  )}
              </Form.Select>
              <FeedbackError error={errors.sort}/>
            </Col>
          </Row>
          
          <Row>
            <Col className='mb-3'>
              <div className='mb-3'>
                <Form.Label htmlFor='subTitle'>Sous-titre</Form.Label>
                <Form.Control
                  disabled={isLoading}
                  isInvalid={errors.subTitle !== null}
                  autoComplete='off'
                  id='subTitle'
                  name='subTitle'
                  value={fields.subTitle}
                  onChange={e => onFieldChange(e, fields, setFields)}/>
                <FeedbackError error={errors.subTitle}/>
              </div>
            </Col>
            
            <Col className='mb-3'>
              <div className='mb-3'>
                <Form.Label htmlFor='priority'>Priorité</Form.Label>
                <Form.Select
                  disabled={isLoading}
                  isInvalid={errors.priority !== null}
                  id='priority'
                  name='priority'
                  value={fields.priority}
                  onChange={e => onFieldChange(e, fields, setFields)}>
                  {newsPriorityOptions.length > 0 && newsPriorityOptions
                    .map((p, i) =>
                      <option key={i} value={p.value}>{p.label}</option>
                    )}
                </Form.Select>
                <FeedbackError error={errors.priority}/>
              </div>
            </Col>
          </Row>
          
          <Form.Label>Contenu | Commentaire(s) :</Form.Label>
          <QuillEditor
            onBlur={onBlur}
            onChange={onContentChange}
            error={errors.content}
            value={fields.content}
          />
          
          <div className='mt-3'>
            <Form.Label htmlFor='address'>Adresse</Form.Label>
            <Form.Control
              disabled={isLoading}
              as='textarea'
              rows={5}
              value={fields.address}
              name='address'
              id='address'
              placeholder='Adresse ici...'
              onChange={e => onFieldChange(e, fields, setFields)}
            />
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button disabled={isLoading} onClick={onAbort} variant='light'>
            <i className='bi bi-x'/> Annuler
          </Button>
          
          {!confirm &&
            <Button disabled={isLoading} onClick={toggleConfirm}>
              {!isLoading && <i className='bi bi-check me-1'/>}
              {isLoading && <Spinner animation='border' size='sm' className='me-1'/>}
              Envoyer
            </Button>}
          
          {confirm &&
            <Button disabled={isLoading} onClick={onSubmit} variant='warning'>
              <i className='bi bi-exclamation-circle-fill me-1'/>
              Confirmation
            </Button>}
        </Modal.Footer>
      </Modal>
    </ErrorBoundary>
  )
}

CreateNewsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
}
