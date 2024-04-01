import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Link} from "react-router-dom";
import {entrypoint} from "../../../app/store";
import avatar2 from "../../../assets/images/avatar/default_profile.jpg";

export default function SalaryItem({data}) {
  const agent = data?.agent ? data.agent : null
  const profile = agent?.profile ? entrypoint+agent.profile?.contentUrl : avatar2
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">
          <div className="d-flex align-items-center">
            <div>
              <img src={profile} alt="" className="avatar-md avatar rounded-circle"/>
            </div>
            <div className="ms-3 lh-1">
              <h5 className=" mb-1">
                <Link to={`#!`}>
                  {agent.name.toUpperCase()+' '}
                  {agent?.lastName && agent.lastName?.toUpperCase()+' '}
                  <span className='text-capitalize'>{agent?.firstName && agent.firstName}</span>
                </Link>
              </h5>
              {agent?.grade &&
                <p className="mb-0">
                  {agent.grade.name.toLowerCase()+' '}/{' '}
                  <Link to={`/app/grades/${agent.grade.id}/show`}><i className='bi bi-link'/></Link>
                </p>}
            </div>
          </div>
        </td>
        <th className='align-middle'>
          {data?.currency && data.currency?.image &&
            <img src={data.currency.image} width={30} height={20} className='me-1' alt=''/>}
          {data.baseAmount}
        </th>
        <td className='align-middle'>{data?.riskPremiumAmount ? data.riskPremiumAmount : '-'}</td>
        <td className='align-middle'>{data?.functionBonusAmount ? data.functionBonusAmount : '-'}</td>
        <th className='align-middle'>
          {data?.total && data.total+' '  }
          {data?.currency && data.currency?.symbol}
        </th>
      </tr>
    </ErrorBoundary>
  )
}
