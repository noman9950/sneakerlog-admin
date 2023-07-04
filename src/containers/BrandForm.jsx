import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import { addBrand, updateBrand, getBrandById } from "../backend/services/brandService";
import {firebase} from "../backend/firebase";
import {imageResizeFileUri} from "../static/_imageUtils";
import { v4 as uuidv4 } from 'uuid';
import SnackBar from "../components/SnackBar";

export default class BrandForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      brand: {
        name: '',
        image: ''
      },
      image: "",
      brandId: '',
      profile_picture: '',
      videoInputCount: 1,
      description: RichTextEditor.createEmptyValue(),
      showSnackBar: false,
      snackBarMessage: "",
      snackBarVariant: "success"
    };
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postBrand = this.postBrand.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.brandId) {
      getBrandById(match.params.brandId)
      .then((response) => {
        this.setState({
          brand: response,
        });
      });
    }
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { brand } = this.state;
    brand[name] = value;
    this.setState({ brand });
  }

  handleVideoURLChange = (event, index) => {
    const { name } = event.target;
    const { brand } = this.state;
    brand[name][index] = event.target.files[0];
    this.setState({ brand });
  }

  postBrand = async(event) => {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, brand, image } = this.state;
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
              .child('Brands')
              .child(`${uuidv4()}.jpeg`);

          if (imageUri) {
              await storageRef.putString(imageUri, 'data_url');
              downloadUrl = await storageRef.getDownloadURL();
          }
        brand.image = downloadUrl;
      }

      if (match.params.brandId) {
        let cloneObject = Object.assign({}, brand)
        updateBrand(match.params.brandId, cloneObject)
          .then((response) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Brand updated successfully",
              snackBarVariant: "success",
            });
          })
          .catch((err) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Error updating brand",
              snackBarVariant: "error",
            });
          })
      }
      else {
        addBrand(brand)
          .then((response) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Brand saved successfully",
              snackBarVariant: "success",
            });
          })
          .catch((err) => {
            this.setState({
              loading: false,
              showSnackBar: true,
              snackBarMessage: "Error adding brand",
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
      loading,
      brand,
      description,
      showSnackBar,
      snackBarMessage,
      snackBarVariant
    } = this.state;
    
    const { match, history } = this.props;
    const isEdit = !!match.params.brandId; 

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
                  <h2>Enter Brand Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postBrand}
                  >

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
                          value={brand.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Image
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          type="file"
                          accept="image/*"
                          name="image"
                          className="form-control"
                          onChange={this.handleProfileImage}
                          // multiple
                          // required
                        />
                      </div>
                    </div>

                    {brand.image && brand.image.length
                      ? (
                        <div className="form-group row">
                        <label className="control-label col-md-3 col-sm-3"></label>
                        <div className="col-md-6 col-sm-6">
                          <img
                            style={{marginRight: '5px'}}
                            width="100"
                            className="img-fluid"
                            src={`${brand.image}`}
                            alt="profileImage"
                          />
                        </div>
                      </div>
                      ) : null
                    }

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Workout Day</label>
                      <div className="col-md-6 col-sm-6">
                      <Select
                        onChange={(val) => this.setWorkoutDay(val)}
                        options={workoutDays}
                        placeholder="Select workout day"
                        value={workoutDay}
                        valueKey="id"
                        labelKey="name"
                        isClearable={false}
                        disabled={workoutDaySelected}
                      />
                      </div>
                    </div> */}

                    {/* <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Timer Type</label>
                      <div className="col-md-6 col-sm-6">
                        <select
                          name="timer_type"
                          value={brand.timer_type}
                          className="form-control"
                          onChange={this.handleInputChange}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="brand">Brand</option>
                          <option value="rest">Rest</option>
                        </select>
                      </div>
                    </div> */}

                    <div className="ln_solid" />
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

