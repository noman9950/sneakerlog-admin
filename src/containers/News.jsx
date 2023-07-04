import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';

import { API_END_POINT } from '../config';
import Cookie from 'js-cookie';
import Swal from 'sweetalert2';
const token = Cookie.get('sneakerlog_access_token');

export default class News extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      news: [],
      activePage: 1,
      pages: 1,
      q: '',
      loading: false,
      responseMessage: 'Loading News...'
    }
  }

  componentWillMount() {
    this.fetchNews();
  }

  fetchNews = () => {
    this.setState({ loading: true })
    axios.get(`${API_END_POINT}/api/v1/news`)
    .then(response => {
      this.setState({
        news: response.data.data,
        loading: false,
        responseMessage: 'No News Found'
      })
    })
    .catch(() => {
      this.setState({
        loading: false,
        responseMessage: 'No News Found...'
      })
    })
  }
  
  deleteNews(newsId, index) {
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
      axios.delete(`${API_END_POINT}/api/v1/news/${newsId}`)
        .then(response => {
          const news = this.state.news.slice();
          news.splice(index, 1);
          this.setState({ news });
          window.alert(response.data.message);
        });
    }
  })}

  handleSelect(page) {
    axios.get(`/api/area?offset=${(page-1)*10}`)
      .then(response => {
        this.setState({
          areas: response.data.items,
          activePage: page
        })
      })
  }

  handleSearch() {
    const { q } = this.state;
    if(q.length) {
    this.setState({loading: true, news: [], responseMessage: 'Loading News...'})
    // if(q === "") {
    //   this.fetchNews();
    // } else {
      axios.get(`${API_END_POINT}/api/items/news/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
      .then((response) => {
        this.setState({
          news: response.data.searchedItems,
          loading: false,
          responseMessage: 'No News Found...'
        })
      })
      .catch(() => {
        this.setState({
          loading: false,
          responseMessage: 'No News Found...'
        })
      })
    }
  }

  render() {
    // console.log(this.state);
    const {loading, news, responseMessage} = this.state; 
    return (
      <div className="row animated fadeIn">
        <div className="col-12">
          <div className="row space-1">
            <div className="col-sm-4">
              <h3>List of News</h3>
            </div>
            <div  className="col-sm-4">
              {/* <div className='input-group'>
                <input
                  className='form-control'
                  type="text"
                  name="search"
                  placeholder="Enter keyword"
                  value={this.state.q}
                  onChange={(event) => this.setState({q: event.target.value}, () => {
                    if(this.state.q === "") {
                      this.fetchNews();
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
              <Link to="/news/news-form">
                <button type="button" className="btn btn-success">Add New News</button>
              </Link>
          </div>

          </div>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Sr. #</th>
                  <th>Title</th>
                  <th>Image</th>
                  <th>Source</th>
                  <th>Article</th>
                </tr>
              </thead>
              <tbody>
                {this.state.news && this.state.news.length >= 1 ?
                this.state.news.map((news, index) => (
                  <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{news.name}</td>
                  <td>{news.image}</td>
                  <td>{news.source}</td>
                  <td>{news.article}</td>
                  <td>
                    <Link to={`/news/edit-news/${news.id}`}>
                      <span className="fa fa-edit" aria-hidden="true"></span>
                    </Link>
                  </td>
                  <td>
                    <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true" onClick={() => this.deleteNews(news.id, index)}></span>
                  </td>
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
            <Pagination prev next items={this.state.pages} activePage={this.state.activePage} onSelect={this.handleSelect.bind(this)}> </Pagination>
          </div> */}
        </div>
      </div>
    );
  }
}
