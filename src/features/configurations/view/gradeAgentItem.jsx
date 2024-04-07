import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import avatar2 from "../../../assets/images/avatar/default_profile.jpg";
import {Link} from "react-router-dom";
import {entrypoint} from "../../../app/store";
import {sexLabel, stateColor, stateLabel} from "../../../services";
import {Badge} from "react-bootstrap";

export default function GradeAgentItem({data, grade, service}) {
  const profile = data?.profile ? entrypoint+data.profile?.contentUrl : null
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      {data &&
        <tr>
          <td className="align-middle">
            <div className="d-flex align-items-center">
              <div>
                <img src={profile ? profile : avatar2} alt="" className="avatar-md avatar rounded-circle"/>
              </div>
              <div className="ms-3 lh-1">
                <h5 className=" mb-1">
                  <Link to={`/app/agents/${data?.id}/show`} className='text-dark text-uppercase'>
                    {data.name+' '}
                    {data?.lastName && data.lastName+' '}
                    {data?.firstName && data.firstName}
                  </Link>
                </h5>
                {data?.grade && (
                  <p className="mb-0 text-uppercase">
                    {data.grade?.name} / <Link to={`/app/grades/${data.grade?.id}/show`}>
                    <i className='bi bi-link'/>
                  </Link>
                  </p>
                )}
                {grade && (
                  <p className="mb-0 text-uppercase">
                    {grade?.name} / <Link to={`/app/grades/${grade?.id}/show`}>
                    <i className='bi bi-link'/>
                  </Link>
                  </p>
                )}
              </div>
            </div>
          </td>
          <td className="align-middle">{data?.sex ? sexLabel[data.sex] : '-'}</td>
          <td className="align-middle">{data?.phone ? data.phone : '-'}</td>
          <td className="align-middle text-uppercase">
            {service
              ? <Link to={`/app/services/${service.id}/show`}>{service.name}</Link>
              : data?.service
                ? <Link to={`/app/services/${data.service.id}/show`}>{data.service.name}</Link>
                : '-'}
          </td>
          <td className="align-middle">
            <Badge bg={stateColor[data?.state]}>
              {stateLabel[data?.state]}
            </Badge>
          </td>
          <td className="align-middle text-end">
            <Link to={`/app/agents/${data.id}/show`}><i className='bi bi-link'/></Link>
          </td>
        </tr>}
    </ErrorBoundary>
  )
}
