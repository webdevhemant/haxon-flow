import PropTypes from 'prop-types'

export const RequireAuth = ({ children }) => children

RequireAuth.propTypes = {
    permission: PropTypes.string,
    display: PropTypes.string,
    children: PropTypes.element
}
