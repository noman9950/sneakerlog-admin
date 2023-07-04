import React, {Component} from 'react';
import {
  Nav,
  NavItem,
  NavbarToggler,
  NavbarBrand,
  UncontrolledTooltip
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import faviLogo from "../img/favicon_io/192x192.png"
import logo from "../img/sneaker.png"
const style = {
  logoWrapper: {
    width: '100%',
    margin: '0 auto',
    overflow: 'hidden'
  },
  svg: {
    width: '100%',
    fill: '#ef5350',
    height: '36px'
  },
  img: {
    height: '35px',
    width: '35px',
    borderRadius: '50%',
    margin: '0 10px'
  },
  companyLogo: {
    width: '130px',
    height: '45px',
    objectFit: 'contain',
    overflow: 'hidden',
  }
};

class Header extends Component {
 
  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
  }

  sidebarMinimize(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-minimized');
  }

  mobileSidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-mobile-show');
  }

  asideToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('aside-menu-hidden');
  }

  render() {
    return (
      <header className="app-header navbar">
        <NavbarToggler className="d-lg-none" onClick={this.mobileSidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>
        <NavbarBrand href="/" className="p-0">
          <div style={style.logoWrapper} className={`svg-logo`}>
            <img className={`img-fluid companyLogo`} src={logo} />
          </div>
          <div style={{backgroundColor: "#382636"}} className={`png-logo`}>
            <img className={`img-fluid companyLogo`} src={faviLogo} />
          </div>
        </NavbarBrand>
        <NavbarToggler className="d-md-down-none mr-auto" onClick={this.sidebarToggle}>
          <span className="navbar-toggler-icon"></span>
        </NavbarToggler>
        {/* <h3 className="mr-auto d-md-down-none admin-heading">Sneaker Log Dashboard</h3> */}
        {this.props.currentUserImage ?
          <div className="user-image">
            <Link to={{ pathname: `/users/edit-user/${this.props.currentUserId}` }} id="user_img_tooltip">
              <img style={style.img} src={`${this.props.currentUserImage}`}/>
            </Link>
            <UncontrolledTooltip placement="left" target="user_img_tooltip">
              <div className={`text-right`}>
                {this.props.currentUserFullName} <br/>
                {this.props.currentUserEmail}
              </div>
            </UncontrolledTooltip>
          </div> : null
        }
      </header>
    );
  }
}

const mapStateToProps = state => {
  const user = state.user.user || {};
  return {
    currentUserImage: user.profile_image,
    currentUserId: user.id,
    currentUserFullName: user.first_name + ' ' + user.last_name,
    currentUserEmail: user.email
  };
};

export default connect(mapStateToProps)(Header);
