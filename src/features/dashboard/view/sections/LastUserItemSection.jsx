import avatar2 from '../../../../assets/images/avatar/avatar-2.jpg';
import {Dropdown} from "react-bootstrap";

const items = [
  {title: 'Voir', event: 'show'},
  {title: 'Modifier', event: 'edit'},
  {title: 'Supprimer', event: 'delete'},
]

export default function LastUserItemSection({data}) {
  function onFilterClick(event) {
  }
  
  return (
    <>
      <tr>
        <td className="align-middle">
          <div className="d-flex align-items-center">
            <div>
              <img src={avatar2} alt="" className="avatar-md avatar rounded-circle"/>
            </div>
            <div className="ms-3 lh-1">
              <h5 className=" mb-1">Anita Parmar</h5>
              <p className="mb-0">anita@example.com</p>
            </div>
          </div>
        </td>
        <td className="align-middle">Front End Developer</td>
        <td className="align-middle">3 May, 2023</td>
        
        <td className="align-middle text-end">
          <Dropdown className='dropstart' children={
            <>
              <Dropdown.Toggle className='bg-white border-0 shadow-none'>
                <i className='bi bi-three-dots-vertical text-primary'/>
              </Dropdown.Toggle>
              
              <Dropdown.Menu>
                {items.length > 0 && items.map((f, i) =>
                  <Dropdown.Item key={i} onClick={() => onFilterClick(f.event)}>
                    {f.title}
                  </Dropdown.Item>)}
              </Dropdown.Menu>
            </>
          }/>
        </td>
      </tr>
    </>
  )
}
