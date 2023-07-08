import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { addUser, updateUser, getUserById } from "../backend/services/usersService";
import {firebase} from "../backend/firebase";
import {imageResizeFileUri} from "../static/_imageUtils";
import { v4 as uuidv4 } from 'uuid';
import SnackBar from "../components/SnackBar";

import Select from 'react-select';
//import 'react-select/dist/react-select.css';
export default class UserForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {
        uuid: '',
        name: '',
        username: '',
        phone: '',
        collections: '',
        sneakerSize: '',
        exports: '',
        sneakerCount: '',
        sneakerScans: '',
        profileImage: '',
        timestampRegister: new Date(),
      },
      image: "",
      userId: '',
      description: RichTextEditor.createEmptyValue(),
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success"
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.postUser = this.postUser.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.userId)
      getUserById(match.params.userId)
        .then((response) => {
          this.setState({
            user: response,
          });
        })
        .catch((err) => {
          window.alert('ERROR!')
        })
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { user } = this.state;
    user[name] = value;
    this.setState({ user });
  }

  postUser = async (event) => {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, user, image } = this.state;
    if (!loading) {
      this.setState({ loading: true });

      let imageFile = image;

      let downloadUrl;
      let imageUri;

      if (imageFile) {
          imageUri = (await imageResizeFileUri({ file: imageFile }));

          const storageRef = firebase
              .storage()
              .ref()
              .child('Users')
              .child(`${uuidv4()}.jpeg`);

          if (imageUri) {
              await storageRef.putString(imageUri, 'data_url');
              downloadUrl = await storageRef.getDownloadURL();
          }
          user.profileImage = downloadUrl;
      }

      if (match.params.userId) {
        let cloneObject = Object.assign({}, user)
        updateUser(match.params.userId, cloneObject)
          .then((response) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "User updated successfully",
              snackBarVariant: "success",
            });
          })
          .catch((err) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Error updating user",
              snackBarVariant: "error",
            });
          })
      }
      else {
        console.log(user,"userData")
        addUser(user)
          .then((response) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "User saved successfully",
              snackBarVariant: "success",
            });
          })
          .catch((err) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Error creating user",
              snackBarVariant: "error",
            });
          })
      }
    }
  }

  handleProfileImage = (event) => {
    this.setState({
      image: event.target.files[0]
    });
  }

  closeSnackBar = () => {
    const { history } = this.props;
    this.setState({ showSnackBar: false })
    if(this.state.snackBarVariant === "success") {
      history.goBack();
    }
  } 

  render() {
    const {
      user,
      showSnackBar,
      snackBarMessage,
      snackBarVariant
    } = this.state;
    const { match, history } = this.props;
    const isEdit = !!match.params.userId; 

    return (
      <div className="row animated fadeIn">
        {showSnackBar && (
          <SnackBar
            open={showSnackBar}
            message={snackBarMessage}
            variant={snackBarVariant}
            onClose={() => this.closeSnackBar()}
          />
        )}
        <div className="col-12">
          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter User Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postUser}
                  >

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Profile Image
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="profileImage"
                          className="form-control"
                          onChange={this.handleProfileImage}
                        />
                      </div>
                    </div>

                    {user.profileImage && user.profileImage.length
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img
                            style={{marginRight: '5px'}}
                            width="100"
                            className="img-fluid"
                            src={`${user.profileImage}`}
                            alt="profileImage"
                          />
                        </div>
                      </div>
                      ) : null
                    }

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Name
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={user.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Username
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="username"
                          className="form-control"
                          value={user.username}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Phone Number
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          // required
                          type="number"
                          name="phone"
                          className="form-control"
                          value={user.phone}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >No. of Collections
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="collections"
                          className="form-control"
                          value={user.collections}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Sneaker Size
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="sneakerSize"
                          className="form-control"
                          value={user.sneakerSize}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Exports
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="exports"
                          className="form-control"
                          value={user.exports}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Total Sneaker Count
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="sneakerCount"
                          className="form-control"
                          value={user.sneakerCount}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Sneaker Scans
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="sneakerScans"
                          className="form-control"
                          value={user.sneakerScans}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Profile Picture</label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="profile_picture"
                          className="form-control"
                          onChange={this.handleFile}
                          // required
                          // required={coverForm.url ? 0 : 1}
                        />
                      </div>
                    </div> */}
                    <div className="ln_solid"></div>
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button className={`btn btn-success btn-lg ${this.state.loading ? 'disabled' : ''}`}>
                          <i className={`fa fa-spinner fa-pulse ${this.state.loading ? '' : 'd-none'}`} />
                          {isEdit ? " Update" : " Submit"}
                        </Button>
                        <Button
                          onClick={() => history.goBack()}
                          className={`mx-3 btn btn-danger btn-lg`}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}