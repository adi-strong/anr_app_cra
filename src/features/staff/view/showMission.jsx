import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading, QRCodeComponent} from "../../../components";
import {memo, useEffect, useMemo, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {PageLayout} from "../../../layouts";
import {Link, useParams} from "react-router-dom";
import {useReactToPrint} from "react-to-print";
import toast from "react-hot-toast";
import {useGetUniqueMissionQuery} from "../model/mission.api.service";
import {Button, Card, Col, Row, Spinner, Table} from "react-bootstrap";
import logo from "../../../assets/images/background/logo.png";
import moment from "moment/moment";
import {FadeSpinLoader} from "../../../loaders";
import htmlParser from 'html-react-parser';
import {entrypoint} from "../../../app/store";
import EditMissionObservationModal from "./editMissionObservationModal";

const nStyle = {
  fontWeight: 800,
  color: '#0909b0'
}

const style = {fontSize: '0.6rem'}

const style2 = {fontSize: '0.6rem', fontWeight: 800}

const uStyle2 = { borderBottom: '2px solid #0909b0' }

function Item({a, index = 0, length = 0}) {
  const agent = {
    name: a.name?.toUpperCase(),
    lastName: a?.lastName ? a.lastName?.toUpperCase() : null,
    firstName: a?.lastName ? a.firstName?.toUpperCase() : null,
  }
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <p className={`${(index < length ? 'me-1' : '')} ${index === 0 && 'pt-3'}`}>
        <i className='bi bi-person-fill me-1'/>
        {agent.name+' '}
        {agent?.lastName+' '}
        {agent?.firstName+' '}
        {index < length ? ',' : '.'}
      </p> {index < (length - 1) && <hr/>}
    </ErrorBoundary>
  )
}

const ShowMission = () => {
  const dispatch = useDispatch()
  const {user: session} = useSelector(state => state.auth)
  
  useEffect(() => {
    dispatch(onToggleMenu({ menuKey: 'staff' }))
  }, [dispatch])
  
  const {id} = useParams()
  const printRef = useRef()
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  })
  
  const {data, isLoading, isFetching, isError, error, refetch} = useGetUniqueMissionQuery(id)
  
  const onRefresh = async () => await refetch()
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  const [show, setShow] = useState(false)
  
  const toggleShow = () => setShow(!show)
  
  let qrCodeValue
  qrCodeValue = useMemo(() => {
    let str = ""
    if (session) {
      str += "NOM : " + session?.fullName + "\n"
      str += "GRADE : " + session?.grade ? session.grade : ''
    }
    
    return str
  }, [session])
  
  const {show: theme} = useSelector(state => state.theme)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title={`Mission n° ${id}`}/>
      <PageLayout>
        <AppBreadcrumb title={`Mission n° ${id}`}/>
        
        
        <div className='d-flex justify-content-between'>
          <div>
            <Button disabled={isFetching} className='me-1' variant='link' onClick={onRefresh}>
              {isFetching && <Spinner animation='grow' size='sm' className='me-1'/>}
              {!isFetching && <i className='bi bi-arrow-clockwise me-1'/>}
              Actualiser
            </Button>
            
            {!(isError && isLoading) && data &&
              <Link to={`/app/expenses/${data?.expense?.id}/show`}>
                <i className='bi bi-currency-exchange'/> Bon de sorties / dépenses
              </Link>}
          </div>
          
          <div>
            {!(isError && isLoading) && data &&
              <Button disabled={isFetching} onClick={toggleShow} className='me-1'>
                <i className='bi bi-plus-square-fill'/> Observation
              </Button>}
            
            <Button disabled={isFetching} variant='info' className='text-light' onClick={handlePrint}>
              <i className='bi bi-printer-fill'/> Imprimer
            </Button>
          </div>
        </div>
        
        <Card className='mt-5'>
          <Card.Body>
            <div className='container-fluid' ref={printRef}>
              <div className='mt-5 pt-10 px-10 pe-10 mb-3' style={uStyle2}>
                <Row>
                  <Col sm={6} className='mb-3'>
                    <img src={logo} className='rounded-circle' width={80} height={80} alt=''/>
                  </Col>
                  
                  <Col sm={6} className='mb-3 text-end text-dark'>
                    N° 1 | le{' '}
                    {!(isError && isLoading) && data && data?.createdAt && moment(data.createdAt).format('ll')}
                  </Col>
                </Row>
                
                <h2 style={nStyle} className='text-center'>
                  AGENCE NATIONALE DE RENSEIGNEMENTS
                </h2>
                <h6 className='text-center'>rue Philippe 49 731 Dumas-sur-Lebrun</h6>
              </div>
              
              <div className='mt-5 px-10 pe-10 mb-3 text-center'>
                <div className='mt-8 text-start'>
                  <Card.Title className='mb-6'>
                    <span className="fw-bold">Objet :</span> <br/>
                    {!(isError && isLoading) && data && data.object.toUpperCase()}
                  </Card.Title>
                  
                  <Card.Title>
                    <span className="fw-bold">Responsable</span> : <br/>
                    {!(isError && isLoading) && data && data?.agent && (
                      <>
                        {data.agent.name.toUpperCase()+' '}
                        {data.agent?.lastName && data.agent.lastName.toUpperCase()+' '}
                        {data.agent?.firstName && data.agent.firstName.toUpperCase()}
                      </>
                    )}
                  </Card.Title>
                </div>
                
                <h4 className='card-title fw-bold'>MISSION DE SERVICE</h4>
              </div>
              
              {!(isError && isLoading) && data && (
                <div className='mt-5 mb-3'>
                  <Table responsive bordered style={{ border: '1px solid #000' }}>
                    <thead>
                    <tr>
                      <th className='align-middle fw-bold text-center p-1' style={style2} colSpan={5}>
                        <i className='bi bi-calendar2-x-fill'/> MISSION : <span className='mx-4'>DU</span>
                        <span className='text-danger mx-4'>
                          {data?.startAt && moment(data.startAt).format('ll')}
                        </span> AU
                        <span className='text-danger mx-4'>
                          {data?.endAt && moment(data.endAt).format('ll')}
                        </span>
                      </th>
                    </tr>
                    </thead>
                    
                    <thead>
                    <tr>
                      <th
                        width={300}
                        className='bg-light p-1 align-middle text-uppercase text-center text-dark fw-bold'
                        style={style}>
                        date de début
                      </th>
                      <th className='bg-light p-1 align-middle text-uppercase text-center text-dark fw-bold' style={style}>
                        date de fin
                      </th>
                      <th
                        className='bg-light p-1 align-middle text-uppercase text-center text-dark fw-bold'
                        style={style}
                        colSpan={2}>
                        lieu
                      </th>
                    </tr>
                    </thead>
                    
                    <tbody>
                    <tr>
                      <td className='align-middle p-1 text-center' style={style}>
                        {data?.startAt && moment(data.startAt).format('ll')}
                      </td>
                      <td className='align-middle p-1 text-center' style={style}>
                        {data?.endAt && moment(data.endAt).format('ll')}
                      </td>
                      <td
                        className='align-middle bg-light-primary text-dark p-1 text-center text-uppercase'
                        style={style} colSpan={2}>
                        <span className={`text-${theme ? 'dark' : 'dark'}`}>{data?.place}</span>
                      </td>
                    </tr>
                    
                    <tr>
                      <td className='align-middle fw-bold text-dark p-1 text-uppercase bg-light' style={style}>
                        moyen de transport
                      </td>
                      <td className='align-middle p-1 text-uppercase p-1 bg-light text-dark' style={style} colSpan={3}>
                        {data?.transport ? data.transport : '-'}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className='align-middle fw-bold text-dark p-1 text-uppercase bg-light' style={style}>
                        Engin / type de transport
                      </td>
                      <td className='align-middle p-1 text-uppercase p-1 bg-light text-dark' style={style} colSpan={3}>
                        {data?.transportName ? data.transportName : '-'}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className='align-middle fw-bold text-dark p-1 text-uppercase bg-light' style={style}>
                        billet / n° de ticket
                      </td>
                      <td className='align-middle p-1 text-uppercase p-1 bg-light text-dark' style={style} colSpan={3}>
                        {data?.ticketNumber ? data.ticketNumber : '-'}
                      </td>
                    </tr>
                    
                    <tr>
                      <td
                        className='align-middle fw-bold bg-light-danger text-dark p-1 text-uppercase bg-light-dark'
                        style={style}>
                        logement
                      </td>
                      <td
                        className='align-middle p-1 text-uppercase p-1 bg-light-warning text-dark'
                        style={style}
                        colSpan={3}>
                        {data?.accommodation ? data.accommodation : '-'}
                      </td>
                    </tr>
                    
                    <tr>
                      <td
                        className='align-middle fw-bold text-dark p-1 text-uppercase bg-light-dark'
                        style={style}>adresse</td>
                      <td
                        className='align-middle p-1 text-uppercase p-1 bg-light-warning text-dark'
                        style={{ whiteSpace: 'pre-line', fontSize: '0.6rem' }} colSpan={3}>
                        {data?.accommodationAddress ? data.accommodationAddress : '-'}
                      </td>
                    </tr>
                    
                    <tr>
                      <td
                        className='align-middle fw-bold text-dark p-1 text-uppercase bg-light-primary'
                        style={style}>membres de la mission / équipe</td>
                      <td
                        width={400}
                        className='align-middle p-1 text-uppercase p-1 bg-light-primary text-dark'
                        style={style}>
                        {data?.members && data.members?.length > 0 ? data.members?.map((m, i) =>
                          <Item key={i} a={m} length={data.members.length} index={i}/>) : '-'}
                      </td>
                      
                      <td
                        width={100}
                        className='align-middle fw-bold text-dark p-1 text-uppercase bg-light-dark'
                        style={style}>documents</td>
                      <td
                        className='align-middle p-1 text-uppercase p-1 text-dark'
                        style={style}>
                        {data?.roadmap &&
                          <p>
                            <i className='bi bi-cloud-download me-1'/>
                            <a href={entrypoint+data.roadmap?.contentUrl} target='_blank' rel='noreferrer'>
                              fdr (feuille de route)
                            </a>
                          </p>} <hr/>
                        {data?.missionOrder &&
                          <p>
                            <i className='bi bi-cloud-download me-1'/>
                            <a href={entrypoint+data.missionOrder?.contentUrl} target='_blank' rel='noreferrer'>
                              odm (ordre de mission)
                            </a>
                          </p>} <hr/>
                        {data?.exitPermit &&
                          <p>
                            <i className='bi bi-cloud-download me-1'/>
                            <a href={entrypoint+data.exitPermit?.contentUrl} target='_blank' rel='noreferrer'>
                              ads (autorisation de sortie)
                            </a>
                          </p>}
                      </td>
                    </tr>
                    </tbody>
                    
                    <thead>
                    <tr>
                      <th className='text-dark align-middle p-1 text-center' style={style2} colSpan={4}>OBSERVATION</th>
                    </tr>
                    </thead>
                    
                    <tbody>
                    <tr>
                      <td className='align-middle p-1' style={style} colSpan={4}>
                        {data?.observation && htmlParser(data.observation)}
                      </td>
                    </tr>
                    </tbody>
                  </Table>
                </div>
              )}
              
              <Row>
                <Col sm={6}>
                  {session &&
                    <QRCodeComponent value={qrCodeValue}/>}
                </Col>
                
                <Col sm={6} className='text-end text-dark'>
                  <div className='w-30 float-end text-dark' style={{ borderBottom: 'solid 1px #000' }}>
                    <span>SIGNATURE</span>
                  </div>
                </Col>
              </Row>
            </div>
            
            {isLoading && <FadeSpinLoader loading={isLoading}/>}
          </Card.Body>
        </Card>
      </PageLayout>
      
      {!(isError && isLoading) && data &&
        <EditMissionObservationModal
          data={data}
          onRefresh={onRefresh}
          show={show}
          onHide={toggleShow}/>}
    </ErrorBoundary>
  )
}

export default memo(ShowMission)
