import {ErrorBoundary} from "react-error-boundary";
import {AppBreadcrumb, FallBackRender, PageHeading, QRCodeComponent} from "../../../components";
import {memo, useEffect, useMemo, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onToggleMenu} from "../../config/config.slice";
import {useParams} from "react-router-dom";
import {useReactToPrint} from "react-to-print";
import toast from "react-hot-toast";
import {useGetUniqueAssignmentQuery} from "../model/ass.api.slice";
import {Badge, Button, Card, Col, Row, Spinner, Table} from "react-bootstrap";
import {PageLayout} from "../../../layouts";
import {FadeSpinLoader} from "../../../loaders";
import logo from "../../../assets/images/background/logo.png";
import moment from "moment";

const nStyle = {
  fontWeight: 800,
  color: '#0909b0'
}

const style = {fontSize: '0.6rem'}

const style2 = {fontSize: '0.6rem', fontWeight: 800}

const uStyle2 = { borderBottom: '2px solid #0909b0' }

const date = new Date()

const ShowAssignment = () => {
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
  
  const {data, isLoading, isFetching, isError, error, refetch} = useGetUniqueAssignmentQuery(id)
  
  const onRefresh = async () => await refetch()
  
  useEffect(() => {
    if (isError) {
      if (error?.error) toast.error(error.error)
      if (error?.data && error.data['hydra:description']) toast.error(error.data['hydra:description'])
    }
  }, [isError, error])
  
  let qrCodeValue
  qrCodeValue = useMemo(() => {
    let str = ""
    if (session) {
      str += "NOM : " + session?.fullName + "\n"
      str += "GRADE : " + session?.grade ? session.grade : ''
    }
    
    return str
  }, [session])
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <PageHeading title={`Affectation n° ${id}`}/>
      <PageLayout>
        <AppBreadcrumb title={`Affectation n° ${id}`}/>
        
        
        <div className='d-flex justify-content-between'>
          <div>
            <Button disabled={isFetching} className='me-1' variant='link' onClick={onRefresh}>
              {isFetching && <Spinner animation='grow' size='sm' className='me-1'/>}
              {!isFetching && <i className='bi bi-arrow-clockwise me-1'/>}
              Actualiser
            </Button>
          </div>
          
          <div>
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
                <h4 className='card-title fw-bold'>FICHE D'AFFECTATION
                  <span className='fw-normal text-decoration-underline mx-1'>n°{id}</span>
                </h4>
              </div>
              
              {!(isError && isLoading) && data && (
                <div className='mt-5 mb-3'>
                  <Table responsive bordered style={{ border: '1px solid #000' }}>
                    <thead>
                    <tr>
                      <th
                        className='align-middle text-center text-uppercase bg-light-dark p-1'
                        style={style2} colSpan={3}>
                        <i className='bi bi-calendar2-x-fill'/> Affectation{' '}
                        {(data?.startAt && data?.endAt) ?
                          <span className='text-danger'>
                            <span className='mx-4 me-4'>du</span>
                            {moment(data.startAt).format('ll')} <span className='mx-4 me-4'>au</span>
                            {moment(data.endAt).format('ll')}
                          </span> :
                          <span className='text-danger'>
                            à durée indéterminée
                          </span>}
                      </th>
                    </tr>
                    </thead>
                    
                    <thead>
                    <tr>
                      <th className='align-middle p-1 text-center text-dark' style={style2}>NOM</th>
                      <th className='align-middle p-1 text-center text-dark' style={style2}>POSTNOM</th>
                      <th className='align-middle p-1 text-center text-dark' style={style2}>PRÉNOM</th>
                    </tr>
                    </thead>
                    
                    <tbody>
                    {data?.agent && (
                      <tr>
                        <td className='text-center text-uppercase text-dark p-1' style={style}>
                          {data.agent.name}
                        </td>
                        <td className='text-center text-uppercase text-dark p-1' style={style}>
                          {data.agent?.lastName && data.agent.lastName}
                        </td>
                        <td className='text-center text-uppercase text-dark p-1' style={style}>
                          {data.agent?.firstName && data.agent.firstName}
                        </td>
                      </tr>
                    )}
                    </tbody>
                    
                    <tbody>
                    <tr>
                      <td className='text-center bg-light text-uppercase text-dark p-1' style={style2} rowSpan={2}>
                        provenance(s) / origine(s)
                      </td>
                      <td className='text-center bg-light-danger text-uppercase text-dark p-1' style={style2}>
                        province
                      </td>
                      <td className='text-center bg-danger text-uppercase text-light p-1' style={style}>
                        {data?.originProvince && data.originProvince?.name}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className='text-center bg-light-danger text-uppercase text-dark p-1' style={style2}>
                        département / direction
                      </td>
                      <td className='text-center bg-danger text-uppercase text-light p-1' style={style}>
                        {data?.origin && data.origin?.name}
                      </td>
                    </tr>
                    </tbody>
                    
                    <tbody>
                    <tr>
                      <td className='text-center bg-light text-uppercase text-dark p-1' style={style2} rowSpan={2}>
                        destination(s)
                      </td>
                      <td className='text-center bg-light-success text-uppercase text-dark p-1' style={style2}>
                        province
                      </td>
                      <td className='text-center bg-success text-uppercase text-light p-1' style={style}>
                        {data?.province && data.province?.name}
                      </td>
                    </tr>
                    
                    <tr>
                      <td className='text-center bg-light-success text-uppercase text-dark p-1' style={style2}>
                        département / direction
                      </td>
                      <td className='text-center bg-success text-uppercase text-light p-1' style={style}>
                        {data?.destination && data.destination?.name}
                      </td>
                    </tr>
                    </tbody>
                    
                    <tbody>
                    <tr>
                      <td className='align-middle bg-light-primary text-center text-uppercase p-1' style={style2}>
                        durée
                      </td>
                      <td className='align-middle text-uppercase bg-light-primary p-1' style={style} colSpan={2}>
                        {(data?.startAt && data?.endAt) ?
                          <span>
                            <span className='mx-4 me-4'>du</span>
                            {moment(data.startAt).format('ll')} <span className='mx-4 me-4'>au</span>
                            {moment(data.endAt).format('ll')} --
                            <span className='mx-4'>
                              {moment(data.endAt).diff(date, 'days')} jour(s){' - '}
                              {(moment(data.endAt).diff(date, 'days') <= 0)
                                ? <Badge bg='danger'>inactif</Badge> :
                                <Badge bg='success'>actif</Badge>}
                            </span>
                          </span> :
                          <span>
                            à durée indéterminée
                          </span>}
                      </td>
                    </tr>
                    </tbody>
                  </Table>
                  
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
              )}
            </div>
            
            {isLoading && <FadeSpinLoader loading={isLoading}/>}
          </Card.Body>
        </Card>
      </PageLayout>
    </ErrorBoundary>
  )
}

export default memo(ShowAssignment)
