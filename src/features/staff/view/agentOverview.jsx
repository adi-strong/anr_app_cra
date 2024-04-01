import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender, RowContent, RowContent2} from "../../../components";
import {Badge, Card, Col, Row} from "react-bootstrap";
import {maritalStatusLabel, sexLabel, stateColor, stateLabel} from "../../../services";
import moment from "moment";
import {Link} from "react-router-dom";
import {FadeSpinLoader} from "../../../loaders";

export default function AgentOverview({agent, isError, loader}) {
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <Col xxl={12}>
        <Card>
          <Card.Body>
            <h4 className="card-title mt-3">Aperçu</h4> <hr/>
            
            {!(isError && loader) && agent && (
              <Row>
                <Col className='mb-3'>
                  <RowContent2 title='Nom' content={agent.name.toUpperCase()}/>
                  <RowContent2 title='Postnom' content={agent?.lastName && agent.lastName.toUpperCase()}/>
                  <RowContent2 title='Prénom' content={agent?.firstName && agent.firstName.toUpperCase()}/>
                  
                  <RowContent2
                    title='Sexe'
                    content={agent?.sex && sexLabel[agent.sex]}/>
                  
                  <RowContent2
                    title='état-civil'
                    content={agent?.maritalStatus && maritalStatusLabel[agent.maritalStatus]}/>
                  
                  <RowContent2
                    title='Lieu & date de naissance'
                    content={(
                      <>
                        {agent?.bornPlace && agent.bornPlace+' / '}
                        {agent?.bornAt && moment(agent.bornAt).format('ll')}
                      </>
                    )}/>
                  
                  <RowContent2 title='N° Tél.' content={agent.phone}/>
                  <RowContent2 title='E-mail' content={agent?.email && agent.email}/>
                  
                  <RowContent2
                    title='état'
                    content={<Badge bg={stateColor[agent.state]}>{stateLabel[agent.state]}</Badge>}/>
                </Col>
                
                <Col className='mb-3'>
                  <RowContent2 title='Pseudonyme' content={agent.pseudo}/>
                  <RowContent2 title='Matricule' content={agent.register}/>
                  <RowContent2 title='N° de Carte' content={agent?.cartNumber && agent.cartNumber}/>
                  <RowContent2 title='Origine' content={agent.origin}/>
                  <RowContent2 title="Niveau d'étude" content={agent.levelOfStudies}/>
                  <RowContent2 title='Père' content={agent?.father && agent.father}/>
                  <RowContent2 title='Mère' content={agent?.mather && agent.mather}/>
                  <RowContent2 title='Groupe sanguin' content={agent?.blood && agent.blood}/>
                </Col>
                
                <Col className='mb-3'>
                  <RowContent2 title='Province' content={agent.province.name.toUpperCase()}/>
                  
                  <RowContent2
                    title='Département / Direction'
                    content={agent?.department && (
                      <>
                        {agent.department?.paths && agent.department.paths?.length > 0
                          && (
                            <span>
                              <i className='bi bi-house-fill me-1 text-primary'/>
                              {agent.department.paths.map((d, i) =>
                                <Link key={i} to={`/app/departments/${d.id}/${d?.slug}`}>
                                  {d?.name} <i className='text-secondary'>/</i>
                                </Link>)}
                            </span>
                          )} <br/>
                        {agent.department.name.toUpperCase()}
                      </>
                    )}/>
                  
                  <RowContent2 title='Grade' content={agent?.grade && agent.grade.name.toUpperCase()}/>
                  <RowContent2 title='Service' content={agent?.service && agent.service.name.toUpperCase()}/>
                  <RowContent2 title='Fonction' content={agent?.job && agent.job.name.toUpperCase()}/>
                </Col>
              </Row>
            )}
            
            <h4 className="card-title mt-3">Composition familiale</h4> <hr/>
            
            <Row>
              <RowContent
                label='CONJOINT(E)'
                content={(
                  <>
                    {agent?.conjoint && agent.conjoint}
                    {agent?.children && agent.children?.length > 0 && (
                      <>
                        <br/>
                        <span className="mx-2 fw-bold">{agent.children.length} enfant(s)</span>
                      </>
                    )}
                  </>
                )}/>
              
              <RowContent
                label='ENFANT(S)'
                content={agent?.children && agent.children?.length > 0 && agent.children?.map((c, i) =>
                  <Row key={i} className='mt-3 px-2'>
                    <RowContent label='NOM' content={c?.name && c.name}/>
                    <RowContent label='LIEU DE NAISSANCE' content={c?.bornPlace && c.bornPlace}/>
                    <RowContent label='DATE DE NAISSANCE' content={c?.bornAt && moment(c.bornAt).format('ll')}/>
                    {agent.children.length > 1 && <hr/>}
                  </Row>)}/>
            </Row>
            
            {loader && <FadeSpinLoader loading={loader}/>}
          </Card.Body>
        </Card>
      </Col>
    </ErrorBoundary>
  )
}
