import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import {Pagination, Modal, Button} from 'react-bootstrap';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {getAdmins, deleteAdmin} from "../backend/services/adminService";
import {sendForgotPasswordEmail} from "../backend/services/authService";
import SnackBar from "../components/SnackBar";
import Swal from "sweetalert2";
import { connect } from "react-redux";
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
import { Pagination } from 'react-bootstrap';
const token = Cookie.get('sneakerlog_access_token');

class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      admins: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: true,
      responseMessage: 'Loading Admins...',
      showModal: false,
      inviteEmail: "",
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success"
    }
  }

  componentWillMount() {
    this.fetchAdmins();
  }

  fetchAdmins = () => {
    this.setState({ loading: true })
    getAdmins()
      .then(response => {
        this.setState({
          admins: response,
          loading: false,
          responseMessage: 'No Admins Found'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Admins Found...'
        })
      })
  }
  fetchAdminsNext = (a) => {
    console.log(a,"kkkkkkk")
    this.setState({ loading: true })
    getAdmins()
      .then(response => {
        this.setState({
          admins: response,
          activePage:a+1,
          loading: false,
          responseMessage: 'No Admins Found'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Admins Found...'
        })
      })
  }
  fetchAdminsPrew = (a) => {
    console.log(a,"kkkkkkk")
    this.setState({ loading: true })
    getAdmins()
      .then(response => {
        this.setState({
          admins: response,
          activePage:a-1,
          loading: false,
          responseMessage: 'No Admins Found'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No Admins Found...'
        })
      })
  }
  deleteAdmin(adminId, index) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.value) {
        deleteAdmin(adminId)
        .then(response => {
          const admins = this.state.admins.slice();
          admins.splice(index, 1);
          this.setState({ admins });
          window.alert(response.data.message);
        })
        .catch(() => {
          this.setState({
            showSnackBar: true,
            snackBarMessage: "Error deleting admin",
            snackBarVariant: "error",
          });
        })
    }
  })
  }

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page - 1) * 10}`)
      .then(response => {
        this.setState({
          areas: response.data.items,
          activePage: page
        })
      })
  }

  handleInputChange = (event) => {
    this.setState({ inviteEmail: event.target.value });
  }

  handleSearch() {
    const { q } = this.state;
    if (q.length) {
      this.setState({ loading: true, admins: [], responseMessage: 'Loading Admin...' })
      // if(q === "") {
      //   this.fetchAdmins();
      // } else {
      axios.get(`${API_END_POINT}/api/items/admin/search`, { params: { "searchWord": this.state.q }, headers: { "auth-token": token } })
        .then((response) => {
          this.setState({
            admins: response.data.searchedItems,
            loading: false,
            responseMessage: 'No Admins Found...'
          })
        })
        .catch(() => {
          this.setState({
            loading: false,
            responseMessage: 'No Admins Found...'
          })
        })
    }
  }

  toggleModal = (value) => {
    this.setState({
      showModal: !this.state.showModal
    }, () => {
      if(value === "send" && this.state.inviteEmail.length) {
        window.alert("Email Sent")
      }
    })
  }

  resetPassword = (email) => {
    sendForgotPasswordEmail(email)
    .then(() => {
      this.setState({
        showSnackBar: true,
        snackBarMessage: "Link has been sent to the email address",
        snackBarVariant: "success",
      });
    })
    .catch((err) => {
      this.setState({
        showSnackBar: true,
        snackBarMessage: "Error while sending reset password email",
        snackBarVariant: "error",
      });
    })
  }

  closeSnackBar = () => {
    this.setState({ showSnackBar: false })
  }

  render() {
    const { loading, admins, responseMessage, showModal, inviteEmail,
      showSnackBar,
      snackBarMessage,
      snackBarVariant } = this.state; 
      const {currentUser} = this.props;
    return (
      <Fragment>
        {showSnackBar && (
          <SnackBar
            open={showSnackBar}
            message={snackBarMessage}
            variant={snackBarVariant}
            onClose={() => this.closeSnackBar()}
          />
        )}
        <div className="row animated fadeIn">
          <div className="col-12">
            <div className="row space-1">
              <div className="col-sm-4">
                <h3>List of Admins</h3>
              </div>
              <div className="col-sm-4">
                {/* <div className='input-group'>
                <input
                  className='form-control'
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  onChange={(event) => this.setState({q: event.target.value}, () => {
                    if(this.state.q === "") {
                      this.fetchAdmins();
                    }
                  })}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      this.handleSearch();
                    }
                  }}
                />
                <span className="input-group-btn" >
                  <button type="button" onClick={() => this.handleSearch()} className="btn btn-info search-btn">Search</button>
                </span>
              </div> */}
              </div>

              <div className="col-sm-4 pull-right mobile-space">
                <a>
                <button type="button" onClick={() => this.toggleModal()} className="btn btn-info mr-2">Invite Admin</button>
                </a>
                <Link to="/admin/admin-form">
                  <button type="button" className="btn btn-success">Add New Admin</button>
                </Link>
              </div>

            </div>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Sr. #</th>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  
                  {/* {this.state.admins && this.state.admins.length >= 1 ? */}
                  {this.state.loading==false ?
                    this.state.admins.map((admin, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{admin.name}</td>
                        <td>{admin.email}</td>
                        {/* <td>
                          <Link to={`/admin/edit-admin/${admin.id}`}>
                            <span className="fa fa-edit" aria-hidden="true"></span>
                          </Link>
                        </td>
                        <td>
                          <span className="fa fa-trash" style={{ cursor: 'pointer' }} aria-hidden="true" onClick={() => this.deleteAdmin(admin.id, index)}></span>
                        </td> */}
                        {!!currentUser && (currentUser.user.email === admin.email)
                        ?
                        <td>
                          <button className="btn btn-warning" onClick={() => this.resetPassword(admin.email)}>
                            Send Reset Password Email
                          </button>
                        </td>
                        :
                        <td></td>
                        }
                      </tr>
                    )) :
                    (
                      <tr>
                        <td colSpan="15" className="text-center">{responseMessage}</td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
            </div>
            {/* <div className="text-center">
                            <Pagination>
                                            <Pagination.Prev disabled={this.state.activePage>1?false:true}  onClick={()=>{this.fetchAdminsPrew(this.state.activePage)}}/>
                                            <Pagination.Next disabled={this.state.activePage<this.state.pages?false:true} onClick={()=>{this.fetchAdminsNext(this.state.activePage)}}/>
                                        </Pagination>
                        </div> */}
            
          </div>
        </div>
        {showModal && (
          <Modal size="md" isOpen={showModal} toggle={() => this.toggleModal()} className={"operator-modal"}>
            <ModalHeader toggle={() => this.toggleModal()}>Invite Admin</ModalHeader>
            <ModalBody>
              <input
                required
                type="email"
                name="email"
                className="form-control"
                value={inviteEmail}
                onChange={this.handleInputChange}
              />
            </ModalBody>
            <ModalFooter>
              <Button type="reset" color="success" size="md" onClick={() => this.toggleModal("send")}>Invite</Button>
            </ModalFooter>
          </Modal>
        )}
      </Fragment>
    );
  }
}


const mapStateToProps = state => {
  const user = state.user || null;
  return {
    // currentUserImage: user.profile_image,
    // currentUserId: user.id,
    // currentUserFullName: user.first_name + ' ' + user.last_name,
    // currentUserEmail: user.email,
    currentUser: user,
  };
};

export default connect(mapStateToProps)(Admin);