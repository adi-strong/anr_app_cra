import {ErrorBoundary} from "react-error-boundary";
import {AppOffCanvas, FallBackRender} from "../../../components";
import {Link, useNavigate} from "react-router-dom";
import {Dropdown} from "react-bootstrap";
import {agentActionItems} from "../../staff/model/agent.service";
import {onSocietyActionsFilter} from "../model/society.service";
import {useState} from "react";
import SocietyForm from "./societyForm";

export default function SocietyItem({data, onRefresh}) {
  const navigate = useNavigate()
  
  const [show, setShow] = useState(false)
  
  const toggleShow = () => setShow(!show)
  
  return (
    <ErrorBoundary fallbackRender={FallBackRender}>
      <tr>
        <th className='align-middle'>
          <Link to={`#!`}>
            {data.name}
          </Link>
        </th>
        <td className='align-middle'>{data?.tradeName ? data.tradeName : '-'}</td>
        <td className='align-middle'>{data?.focal ? data.focal : '-'}</td>
        <td className='align-middle'>{data?.phone ? data.phone : '-'}</td>
        
        <td className="align-middle text-end">
          <Dropdown className='dropstart' children={
            <>
              <Dropdown.Toggle className='bg-white border-0 shadow-none'>
                <i className='bi bi-three-dots-vertical text-primary'/>
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                {agentActionItems.length > 0 && agentActionItems.map((f, i) =>
                  <Dropdown.Item
                    key={i}
                    className={f?.className}
                    onClick={() => onSocietyActionsFilter(f.event, data, navigate, toggleShow)}>
                    {f.title}
                  </Dropdown.Item>)}
              </Dropdown.Menu>
            </>
          }/>
        </td>
      </tr>
      
      <AppOffCanvas
        title={<><i className='bi bi-pencil-square'/> Modification de la société</>}
        children={<SocietyForm onHide={toggleShow} onRefresh={onRefresh} data={data}/>}
        show={show}
        onHide={toggleShow}/>
    </ErrorBoundary>
  )
}
