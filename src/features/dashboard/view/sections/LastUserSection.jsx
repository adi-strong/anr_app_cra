import {Card, Col} from "react-bootstrap";
import LastUserListSection from "./LastUserListSection";

export default function LastUserSection() {
  return (
    <Col md={8} className='mb-3 mt-2'>
      <Card className='h-100'>
        <Card.Header className='bg-white py-4'>
          <h4 className="mb-0">Derniers comptes crées</h4>
        </Card.Header>
        <LastUserListSection/>
      </Card>
    </Col>
  )
}
