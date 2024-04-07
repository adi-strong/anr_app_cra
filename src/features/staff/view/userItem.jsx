import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender} from "../../../components";
import {useNavigate} from "react-router-dom";
import avatar2 from "../../../assets/images/avatar/default_profile.jpg";
import {onUserActionsFilter, roleLabel, userActionItems} from "../model/user.service";
import {entrypoint} from "../../../app/store";
import {useState} from "react";
import {Badge, Dropdown} from "react-bootstrap";
import UserForm from "./userForm";
import EditUserPassForm from "./editUserPassForm";
import {useSelector} from "react-redux";

export default function UserItem({data, pages, onRefresh}) {
  const role = data?.roles[0]
  const profile = data?.agentAccount && data.agentAccount?.profile ? data.agentAccount.profile?.contentUrl : null
  const navigate = useNavigate()
  const {user: session} = useSelector(state => state.auth)
  
  const [show, setShow] = useState(false)
  const [open, setOpen] = useState(false)
  
  const toggleShow = () => setShow(!show)
  
  const toggleOpen = () => setOpen(!open)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      {session && role && (role !== 'ROLE_SUPER_ADMIN' && data.id !== session?.id) && (
        <tr>
          <td className="align-middle">
            <div className="d-flex align-items-center">
              <div>
                <img src={profile ? entrypoint+profile : avatar2} alt="" className="avatar-md avatar rounded-circle"/>
              </div>
              <div className="ms-3 lh-1">
                <h5 className="text-capitalize mb-1">{data?.username}</h5>
                <p className="mb-0">
                  {roleLabel[role]}
                </p>
              </div>
            </div>
          </td>
          <td className="text-capitalize align-middle">
            {data?.fullName}
          </td>
          <td className="align-middle">{data?.email ? data.email : '-'}</td>
          <td className="align-middle">{data?.phone ? data.phone : '-'}</td>
          <td className="align-middle">
            {data?.isActive
              ? <Badge bg='success'>Actif</Badge>
              : <Badge bg='danger'>Inactif</Badge>}
          </td>
          
          <td className="align-middle text-end">
            <Dropdown className='dropstart' children={
              <>
                <Dropdown.Toggle className='bg-white border-0 shadow-none'>
                  <i className='bi bi-three-dots-vertical text-primary'/>
                </Dropdown.Toggle>
                
                <Dropdown.Menu>
                  {userActionItems.length > 0 && userActionItems.map((f, i) =>
                    <Dropdown.Item
                      key={i}
                      className={f?.className}
                      onClick={() => onUserActionsFilter(f.event, data, navigate, toggleShow, toggleOpen)}>
                      {f.title}
                    </Dropdown.Item>)}
                </Dropdown.Menu>
              </>
            }/>
          </td>
        </tr>
      )}
      
      <AppOffCanvas
        title={<>Réinitialisation du mot de passe</>}
        children={<EditUserPassForm onHide={toggleOpen} onRefresh={onRefresh} data={data}/>}
        show={open}
        onHide={toggleOpen}/>
      
      <AppOffCanvas
        title={<>Édition du compte utilisateur</>}
        children={<UserForm onHide={toggleShow} data={data} onRefresh={onRefresh}/>}
        show={show}
        onHide={toggleShow}/>
    </ErrorBoundary>
  )
}
