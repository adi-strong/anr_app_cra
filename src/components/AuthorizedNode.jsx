import PropTypes from "prop-types";

export default function AuthorizedNode({ userRoles, allowedRoles, children }) {
  // Vérifie si l'utilisateur a au moins l'un des rôles autorisés
  const isAuthorized = userRoles.some(role => allowedRoles.includes(role));
  
  return isAuthorized ? <>{children}</> : null;
};

AuthorizedNode.propTypes = {
  userRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node,
}
