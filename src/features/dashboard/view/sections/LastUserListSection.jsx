import {Table} from "react-bootstrap";
import LastUserItemSection from "./LastUserItemSection";

const items = [
  {label: 'Nom'},
  {label: 'Rôle'},
  {label: 'Date de création'},
]

export default function LastUserListSection() {
  return (
    <Table className='text-nowrap'>
      <thead className='table-light h-100'>
      <tr>
        {items.length > 0 && items.map((t, i) =>
          <th key={i}>{t.label}</th>)}
        <th className='text-end text-primary'>
          <i className='bi bi-arrow-clockwise' style={{ cursor: 'pointer' }}/>
        </th>
      </tr>
      </thead>
      
      <tbody className='h-100'>
      <LastUserItemSection/>
      </tbody>
    </Table>
  )
}
