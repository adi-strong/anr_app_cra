import {Alert} from "react-bootstrap";

export default function FallBackRender({ error }) {
  return (
    <Alert variant='danger'>
      <Alert.Heading>Quelque chose s'est mal passé :</Alert.Heading>
      <pre>{error?.message}</pre>
    </Alert>
  )
}
