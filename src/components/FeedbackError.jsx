import {Form} from "react-bootstrap";

export default function FeedbackError({error = null}) {
  return (
    <>
      <Form.Control.Feedback type='invalid'>{error}</Form.Control.Feedback>
    </>
  )
}
