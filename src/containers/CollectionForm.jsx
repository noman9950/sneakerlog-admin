import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';

import Cookie from 'js-cookie';

import ToggleButton from 'react-ios-switch';

import Select from 'react-select';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
export default class CollectionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      collection: {
        name: '',
        private: false
      },
      workoutDays: [],
      workoutDay: '',
      collectionId: '',
      profile_picture: '',
      videoInputCount: 1,
      description: RichTextEditor.createEmptyValue(),
    };
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postCollection = this.postCollection.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.collectionId) {
      axios.get(`${API_END_POINT}/api/v1/collection/${match.params.collectionId}`)
      .then((response) => {
        let data  = response.data.collection;
        data["video_files"] = [];
        this.setState({
          collection: data,
        }, () => {
          const {collection} = this.state;
          this.getWorkoutDayById(collection.workout_day_id);
          if(collection.videos_url === null) {
            collection.video_files = [];
            this.setState({ collection })
          } else {
            this.setState({videoInputCount: collection.videos_url.length })
          }
        });
      });
    }
    if (match.params.dayId) {
      this.getWorkoutDayById(match.params.dayId)
    } else {
      this.getWorkoutDays();
    }
  }

  getWorkoutDays = () => {
    axios.get(`${API_END_POINT}/api/v1/workout_days`)
    .then(response => {
      this.setState({
        workoutDays: response.data.data,
        responseMessage: 'No Workout Days Found...'
      })
    })
  }

  getWorkoutDayById = (workoutDayId) => {
    axios.get(`${API_END_POINT}/api/v1/workout_days/${workoutDayId}`)
    .then((response) => {
      this.setState({
        workoutDay: response.data.data,
      });
    });
  }

  setWorkoutDay(selectedWorkoutDay) {
    this.setState(prevState => ({
      workoutDay: selectedWorkoutDay,
      collection: {
        ...prevState.collection,
        workout_day_id: !!selectedWorkoutDay ? selectedWorkoutDay.id : "",
      },
    }));
  }

  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      collection: {
        ...prevState.collection,
        city_id: selectedCity.ID,
      },
    }));
  }

  setDescription(description) {
    const { collection } = this.state;
    collection.description = description.toString('html');
    this.setState({
      collection,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { collection } = this.state;
    collection[name] = value;
    this.setState({ collection });
  }

  handleVideoURLChange = (event, index) => {
    const { name } = event.target;
    const { collection } = this.state;
    collection[name][index] = event.target.files[0];
    this.setState({ collection });
  }

  postCollection(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, collection } = this.state;
    if (!loading) {
      const fd = new FormData();

      // let videosArray = [];
      // for (let index = 0; index < collection.video_files.length; index += 1) {
      //   videosArray.push(collection.video_files[index]);
      // }
      if(!!collection.video_files && collection.video_files.length > 0) {
        collection.video_files.forEach((video, index) => {
          fd.append(`video_files[${index}]`, video);
        });
        delete collection["video_files"];
      }

      Object.keys(collection).forEach((eachState) => {
        fd.append(`${eachState}`, collection[eachState]);
      })

      

      this.setState({ loading: true });
      if (match.params.collectionId) {
        axios.put(`${API_END_POINT}/api/v1/collection/${match.params.collectionId}`, fd)
          .then((response) => {
            if (response.data && response.data.status && response.status === 200) {
              window.alert("Updated !");
              this.setState({ loading: false });
            } else {
              window.alert('ERROR UPDATING !')
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            window.alert('ERROR UPDATING !')
            this.setState({ loading: false });
          })
      }
      else {
        axios.post(`${API_END_POINT}/api/v1/collection`, fd)
          .then((response) => {
            if (response.data && response.data.status && response.status === 200) {
              window.alert("SUCCESS !");
              this.setState({ loading: false });
            } else {
              window.alert('ERROR SAVING !')
              this.setState({ loading: false });
            }
          })
          .catch((err) => {
            window.alert('ERROR SAVING !')
            this.setState({ loading: false });
          })
      }
    }
  }

  handleFile = (event) => {
    this.setState({
      profile_picture: event.target.files.length ? event.target.files[0] : '',
    });
  }

  render() {
    const {
      loading,
      collection,
      description,
      workoutDay,
      workoutDays,
      videoInputCount
    } = this.state;
    const workoutDaySelected = this.props.match.params.dayId ? true : false
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">

            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter Collection Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postCollection}
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
                          value={collection.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

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

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Private</label>
                      <div className="col-md-6 col-sm-6">
                      <ToggleButton
                        checked={collection.private}
                        onChange={checked => {collection["private"]= checked; this.setState({collection}) }}
                      />
                      </div>
                    </div>

                    <div className="ln_solid" />
                    <div className="form-group row">
                      <div className="col-md-6 col-sm-6 offset-md-3">
                        <Button className={`btn btn-success btn-lg ${this.state.loading ? 'disabled' : ''}`}>
                          <i className={`fa fa-spinner fa-pulse ${this.state.loading ? '' : 'd-none'}`} /> Submit
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

