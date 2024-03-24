import {Link, useNavigate} from "react-router-dom";
import {ErrorBoundary} from "react-error-boundary";
import {FallBackRender} from "../../../components";
import avatar2 from "../../../assets/images/avatar/avatar-2.jpg";
import {Dropdown} from "react-bootstrap";
import {actionItems} from "../../../services";
import {onCovenantFilterClick} from "../model/covenant.service";

export default function CovenantItem({data}) {
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
                <Link to={`/app/covenants/${1}/show`} className='text-dark'>
                  Orange RDC
                </Link>
              </h5>
            </div>
          </div>
        </td>
        
        <td className="align-middle">
          Debacker LIFWA
        </td>
        <td className="align-middle">+243 904 651 464</td>
        <td className="align-middle">orange.rdc@contact.com</td>
        
        <td className="align-middle text-end">
          <Dropdown className='dropstart' children={
            <>
              <Dropdown.Toggle className='bg-white border-0 shadow-none'>
                <i className='bi bi-three-dots-vertical text-primary'/>
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                {actionItems.length > 0 && actionItems.map((f, i) =>
                  <Dropdown.Item key={i} onClick={() => onCovenantFilterClick(
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
