import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import RichTextEditor from 'react-rte';
import { Button } from 'reactstrap';
import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
import {toolbarConfig} from "../static/_textEditor";

import Select from 'react-select';
//import 'react-select/dist/react-select.css';

export default class NewsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      news: {
        name: '',
        source: '',
        image: '',
      },
      description: RichTextEditor.createEmptyValue(),
    };
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.postNews = this.postNews.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    if (match.params.newsId) {
      axios.get(`${API_END_POINT}/api/v1/news/${match.params.newsId}`)
      .then((response) => {
        let data  = response.data.news;
        data["video_files"] = [];
        this.setState({
          news: data,
        }, () => {
          const {news} = this.state;
          this.getWorkoutDayById(news.workout_day_id);
          if(news.videos_url === null) {
            news.video_files = [];
            this.setState({ news })
          } else {
            this.setState({videoInputCount: news.videos_url.length })
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
      news: {
        ...prevState.news,
        workout_day_id: !!selectedWorkoutDay ? selectedWorkoutDay.id : "",
      },
    }));
  }

  setCity(selectedCity) {
    this.setState(prevState => ({
      city: selectedCity,
      news: {
        ...prevState.news,
        city_id: selectedCity.ID,
      },
    }));
  }

  setDescription(description) {
    const { news } = this.state;
    news.description = description.toString('html');
    this.setState({
      news,
      description,
    });
  }

  handleInputChange(event) {
    const { value, name } = event.target;

    const { news } = this.state;
    news[name] = value;
    this.setState({ news });
  }

  handleVideoURLChange = (event, index) => {
    const { name } = event.target;
    const { news } = this.state;
    news[name][index] = event.target.files[0];
    this.setState({ news });
  }
  handleImages = (event) => {
    const { name } = event.target;
    const { news } = this.state;
    news[name] = event.target.files[0];
    this.setState({ news });
  }

  postNews(event) {
    event.preventDefault();
    const { match, history } = this.props;
    const { loading, news } = this.state;
    if (!loading) {
      const fd = new FormData();

      // let videosArray = [];
      // for (let index = 0; index < news.video_files.length; index += 1) {
      //   videosArray.push(news.video_files[index]);
      // }
      if(!!news.video_files && news.video_files.length > 0) {
        news.video_files.forEach((video, index) => {
          fd.append(`video_files[${index}]`, video);
        });
        delete news["video_files"];
      }

      Object.keys(news).forEach((eachState) => {
        fd.append(`${eachState}`, news[eachState]);
      })

      

      this.setState({ loading: true });
      if (match.params.newsId) {
        axios.put(`${API_END_POINT}/api/v1/news/${match.params.newsId}`, fd)
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
        axios.post(`${API_END_POINT}/api/v1/news`, fd)
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
      news,
      description,
    } = this.state;
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row">

            <div className="col-md-12 col-sm-12">
              <div className="x_panel">
                <div className="x_title">
                  <h2>Enter News Details</h2>
                </div>
                <div className="x_content">
                  <br />
                  <form
                    id="demo-form2"
                    data-parsley-validate
                    className="form-horizontal form-label-left"
                    onSubmit={this.postNews}
                  >

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Title
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="name"
                          className="form-control"
                          value={news.name}
                          onChange={this.handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label
                        className="control-label col-md-3 col-sm-3"
                      >Source
                      </label>
                      <div className="col-md-6 col-sm-6">
                        <input
                          required
                          type="text"
                          name="source"
                          className="form-control"
                          value={news.source}
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
                          onChange={this.handleImages}
                          // multiple
                          // required
                        />
                      </div>
                    </div>

                    <div className="form-group row">
                      <label className="control-label col-md-3 col-sm-3">Article</label>
                      <div className="col-md-6 col-sm-6">
                        <RichTextEditor
                          value={description}
                          toolbarConfig={toolbarConfig}
                          onChange={(e) => {
                            this.setDescription(e);
                          }}
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

