import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import {Link, useNavigate} from "react-router-dom";
import avatar2 from "../../../assets/images/avatar/avatar-2.jpg";
import {Dropdown} from "react-bootstrap";
import {actionItems} from "../../../services";
import {onPatientFilterClick} from "../model/patients.service";

export default function PatientItem({data}) {
  const navigate = useNavigate()
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <td className="align-middle">
          <div className="d-flex align-items-center">
            <div>
              <img src={avatar2} alt="" className="avatar-md avatar rounded-circle"/>
            </div>
            <div className="ms-3 lh-1">
              <h5 className=" mb-1">
                <Link to={`/app/patients/${1}/show`} className='text-dark'>
                  Anita Parmar
                </Link>
              </h5>
              <p className="mb-0">
                adulte / <Link to={`/app/covenants/${1}/show`}>conventioné(e)</Link>
              </p>
            </div>
          </div>
        </td>
        
        <td className="align-middle">
          18 an(s)
        </td>
        <td className="align-middle">Célibataire</td>
        <td className="align-middle">-</td>
        
        <td className="align-middle text-end">
          <Dropdown className='dropstart' children={
            <>
              <Dropdown.Toggle className='bg-white border-0 shadow-none'>
                <i className='bi bi-three-dots-vertical text-primary'/>
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                {actionItems.length > 0 && actionItems.map((f, i) =>
                  <Dropdown.Item key={i} onClick={() => onPatientFilterClick(
                    {},
                    f.event,
                    navigate
                  )} className={f?.className}>
                    {f.title}
                  </Dropdown.Item>)}
              </Dropdown.Menu>
            </>
          }/>
        </td>
      </tr>
    </ErrorBoundary>
  )
}
