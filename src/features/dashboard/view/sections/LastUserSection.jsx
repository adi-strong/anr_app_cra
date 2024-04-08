import {Card, Col} from "react-bootstrap";
import UsersList from "../../../staff/view/usersList";

export default function LastUserSection() {
  return (
    <Col className='mb-3 mt-2'>
      <Card className='h-100'>
        <UsersList/>
      </Card>
    </Col>
  )
}
