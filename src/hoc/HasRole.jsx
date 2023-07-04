import React, { Component, Fragment } from 'react';
import propTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class HasRole extends Component {
  static propTypes = {
    currentUserRole: propTypes.string.isRequired,
    requiredRole: propTypes.array.isRequired,
    currentUserDepartment: propTypes.string.isRequired,
    requiredDepartment: propTypes.array.isRequired,
    superAdmin: propTypes.bool.isRequired
  };

  render() {
    const {
      children,
      currentUserRole,
      requiredRole,
      currentUserDepartment,
      requiredDepartment,
      superAdmin
    } = this.props;
    if (!superAdmin && (requiredRole.indexOf(currentUserRole) === -1 ||
        requiredDepartment.indexOf(currentUserDepartment) === -1)) return null;
    return (
      <Fragment>
        {children}
      </Fragment>
    );
  }
}

const getMapStateToProps = (extendWith = {}) => state => {
  const user = state.user || {};
  return {
    currentUserRole: user.user && user.user.role ? user.user.role : 'nobody',
    currentUserDepartment: user.user && user.user.department ? user.user.department : 'noDepartment',
    superAdmin: user.user && user.user.superadmin ? user.user.superadmin : false,
    ...extendWith
  };
};

export default withRouter(connect(getMapStateToProps())(HasRole));
//export const IsAdmin = connect(getMapStateToProps({requiredRole: ['admin'], requiredDepartment: ['admin']}))(HasRole);
//export const IsUser = connect(getMapStateToProps({requiredRole: ['user'], requiredDepartment: ['admin']}))(HasRole);
