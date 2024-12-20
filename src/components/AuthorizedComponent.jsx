import PropTypes from "prop-types";
import {Alert} from "react-bootstrap";

const AuthorizedComponent = ({ userRoles, allowedRoles, children }) => {
  // Vérifie si l'utilisateur a au moins l'un des rôles autorisés
  const isAuthorized = userRoles.some(role => allowedRoles.includes(role));
  
  return isAuthorized
    ? <>{children}</>
    : (
      <Alert className='mb-0 mt-1'>
        <Alert.Heading className='mt-3 fw-bold'>
          <i className='bi bi-exclamation-circle-fill'/> PAGE NON ACCÉSSIBLE :
        </Alert.Heading>
        <hr/>
        
        <p>
          <i className='bi bi-emoji-dizzy me-1'/>
          <i className='bi bi-emoji-tear-fill me-1'/>
          Vous ne disposez pas de droits requis pour accéder aux données
          <i className='bi bi-exclamation-triangle-fill mx-1'/>
        </p>
      </Alert>
    );
};

/*
// Exemple d'utilisation
const App = () => {
  const userRoles = ['admin', 'moderator'];
  const allowedRoles = ['admin', 'editor'];
  
  return (
    <AuthorizedComponent userRoles={userRoles} allowedRoles={allowedRoles}>
      <div>
        <h1>Composant autorisé</h1>
        <p>Ce composant ne sera rendu que si les rôles conviennent.</p>
      </div>
    </AuthorizedComponent>
  );
};
*/

export default AuthorizedComponent;

AuthorizedComponent.propTypes = {
  userRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node,
}
