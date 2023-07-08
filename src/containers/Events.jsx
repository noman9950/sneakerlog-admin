import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {getEvents, deleteEvent} from "../backend/services/eventService";
// import {Pagination} from 'react-bootstrap';
import SnackBar from "../components/SnackBar";
import Swal from "sweetalert2";

import {API_END_POINT} from '../config';
import Cookie from 'js-cookie';
import moment from 'moment';
import {deleteMultiple} from "../backend/services/usersService";
import {Pagination} from "react-bootstrap";

const token = Cookie.get('sneakerlog_access_token');

export default class Events extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            events: [],
            activePage: 0,
            pages: 0,
            perPage: 20,
            q: '',
            loading: true,
            responseMessage: 'Loading Events...',
            showSnackBar: false,
            snackBarMessage: "",
            snackBarVariant: "success"
        }
    }

    componentWillMount() {
        this.fetchEvent();
    }

    fetchEvent = () => {
        this.setState({loading: true})
        getEvents()
            .then(response => {
                response = response.map((r, index) => {
                    r.checked = false;
                    r.index = index + 1;
                    r.formatted_date=r.date.seconds;
                    return r;
                })

                this.setState({
                    events: response,
                    loading: false,
                    pages: Math.ceil(response.length / this.state.perPage),
                    activePage: 1,
                    responseMessage: 'No Events Found'
                })
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    responseMessage: 'No Events Found...'
                })
            })
    }
    fetchEventPrew = (a) => {
        this.setState({loading: true,responseMessage:"Loading Events..."})
        getEvents()
            .then(response => {
                response = response.map((r, index) => {
                    r.checked = false;
                    r.index = index + 1;
                    r.formatted_date=r.date.seconds;
                    return r;
                })

                this.setState({
                    events: response,
                    loading: false,
                    pages: Math.ceil(response.length / this.state.perPage),
                    activePage: a-1,
                    responseMessage: 'No Events Found'
                })
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    responseMessage: 'No Events Found...'
                })
            })
    }
    fetchEventNext = (a) => {
        this.setState({loading: true,responseMessage:"Loading Events..."})
        getEvents()
            .then(response => {
                response = response.map((r, index) => {
                    r.checked = false;
                    r.index = index + 1;
                    r.formatted_date=r.date.seconds;
                    return r;
                })

                this.setState({
                    events: response,
                    loading: false,
                    pages: Math.ceil(response.length / this.state.perPage),
                    activePage: a+1,
                    responseMessage: 'No Events Found'
                })
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    responseMessage: 'No Events Found...'
                })
            })
    }
    deleteEvent(eventId, index) {
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
                    deleteEvent(eventId)
                        .then(response => {
                            const events = this.state.events.slice();
                            events.splice(index, 1);
                            this.setState({
                                events,
                                showSnackBar: true,
                                snackBarMessage: "Event deleted successfully",
                                snackBarVariant: "success",
                            });
                        })
                        .catch(() => {
                            this.setState({
                                showSnackBar: true,
                                snackBarMessage: "Error deleting event",
                                snackBarVariant: "error",
                            });
                        })
                }
            }
        )
    }

    handleSelect(page) {
        const activePage = this.state.activePage;
        if (page !== activePage) {
            this.setState({activePage: page})
        }
    }

    handleSearch() {
        const {q} = this.state;
        if (q.length) {
            this.setState({loading: true, events: [], responseMessage: 'Loading Event...'})
            // if(q === "") {
            //   this.fetchEvent();
            // } else {
            axios.get(`${API_END_POINT}/api/items/event/search`, {
                params: {"searchWord": this.state.q},
                headers: {"auth-token": token}
            })
                .then((response) => {
                    this.setState({
                        events: response.data.searchedItems,
                        loading: false,
                        responseMessage: 'No Events Found...'
                    })
                })
                .catch(() => {
                    this.setState({
                        loading: false,
                        responseMessage: 'No Events Found...'
                    })
                })
        }
    }

    closeSnackBar = () => {
        this.setState({showSnackBar: false})
    }


    handleSelectEvent = (index) => {
        const eventsList = this.state.events;
        eventsList[index].checked = !eventsList[index].checked;
        this.setState({events: eventsList});
    }

    handleDeleteEvents = async (e) => {
        console.log("testttttt")
        const eventsList = this.state.events;
        const eventsToDelete = (eventsList).filter((event) => event.checked);
        this.setState({loading: true, responseMessage: "Deleting events", events: []})
        await deleteMultiple(eventsToDelete, "Events");
        const filteredEvents = (eventsList).filter((event) => !event.checked).map((event, index) => {
            event.index = index + 1;
            return event;
        });
        this.setState({
            loading: false, events: filteredEvents, responseMessage: "",
            pages: Math.ceil(filteredEvents.length / this.state.perPage),
        });

    }

    onHandleSearch = (type, isDate) => {
        let searchBy = this.state.searchBy;
        if (searchBy) {
            if (searchBy.label === type) {
                this.setState({searchBy: {label: type, orderBy: searchBy.orderBy === "asc" ? "desc" : "asc"},activePage:1});
            } else {
                this.setState({searchBy: {label: type, orderBy: "desc", isDate: isDate},activePage:1});
            }
        } else {
            this.setState({searchBy: {label: type, orderBy: "desc", isDate: isDate},activePage:1});

        }
    }


    render() {
        const {
            loading, responseMessage,
            showSnackBar,
            snackBarMessage,
            snackBarVariant,
            searchBy, activePage, perPage

        } = this.state;

        let events = JSON.parse(JSON.stringify(this.state.events));
        const page = activePage - 1;
        if (searchBy) {
            if (searchBy.orderBy === "asc") {
                events = events.sort(function (a, b) {
                    return  ('' + a[searchBy.label]).localeCompare(b[searchBy.label], undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    })
                        ;
                });
            } else {
                events = events.sort(function (a, b) {
                    return  ('' + b[searchBy.label]).localeCompare(a[searchBy.label], undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    })
                });
            }
        }

        events=events.map((event,index)=>{
            event.index=index+1
            return event;
        })


        let paginatedEvents = JSON.parse(JSON.stringify(events)).slice((page) * perPage, (page + 1) * perPage);
        let checkedEvents = paginatedEvents.filter((event) => event.checked);


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
                    <div className="row space-1">
                        <div className="col-sm-4">
                            <h3>List of Events</h3>
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
                      this.fetchEvent();
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
                            {checkedEvents.length > 0 &&
                            <button type="button" className="btn btn-danger" onClick={this.handleDeleteEvents}>Delete Events</button>
                            }
                            <Link to="/events/event-form">
                                <button type="button" className="btn btn-success" style={{marginLeft: "10px"}}>Add New
                                    Event
                                </button>
                            </Link>
                        </div>

                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>Sr. #</th>
                                <th>Title <span onClick={(e) => this.onHandleSearch("name", false)}><img
                                    style={{height: "15px"}} src={"././img/descendant.png"}/></span>
                                </th>
                                <th>Image</th>
                                <th>Location <span onClick={(e) => this.onHandleSearch("location", false)}><img
                                    style={{height: "15px"}} src={"././img/descendant.png"}/></span>
                                </th>
                                <th style={{width:"1%",whiteSpace:"nowrap"}}>Date <span onClick={(e) => this.onHandleSearch("formatted_date", true)}><img
                                    style={{height: "15px"}} src={"././img/descendant.png"}/></span></th>
                                <th>Time</th>
                                <th>About</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* {paginatedEvents && paginatedEvents.length >= 1 ? */}
                            {this.state.loading==false?
                                paginatedEvents.map((event, index) => (
                                    <tr key={index}>
                                        <td>
                                             <span>
                                            <input type={"checkbox"} checked={event.checked}
                                                   onChange={(e) => this.handleSelectEvent(event.index - 1)}/>
                                        </span>
                                            {event.index}</td>
                                        <td>{event.name}</td>
                                        <td>{<img style={{height: '50px', width: '50px'}} src={event.image}/>}</td>
                                        <td>{event.location}</td>
                                        <td>{moment(new Date(event.date.seconds * 1000)).format("DD MMM YYYY")}</td>
                                        <td>{event.time && event.time.startTime && event.endTime ? `${moment(new Date(event.time.startTime.seconds * 1000)).format("hh:mm A")} - ${moment(new Date(event.time.endTime.seconds * 1000)).format("hh:mm A")}` : null}</td>
                                        <td dangerouslySetInnerHTML={{__html: event.about}}></td>
                                        <td>
                                            <Link to={`/events/edit-event/${event.uuid}`}>
                                                <span className="fa fa-edit" aria-hidden="true"></span>
                                            </Link>
                                        </td>
                                        <td>
                                            <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true"
                                                  onClick={() => this.deleteEvent(event.uuid, index)}></span>
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
                    <div className="text-center">
                            <Pagination>
                                            <Pagination.Prev disabled={this.state.activePage>1?false:true}  onClick={()=>{this.setState({activePage:this.state.activePage-1})}}/>
                                            <Pagination.Next disabled={this.state.activePage<this.state.pages?false:true} onClick={()=>{this.setState({activePage:this.state.activePage+1})}}/>
                                        </Pagination>
                        </div>
                    {/* <div className="text-center">
                        <Pagination prev next items={this.state.pages} activePage={this.state.activePage}
                                    onSelect={this.handleSelect.bind(this)}> </Pagination>
                    </div> */}
                </div>
            </div>
        );
    }
}
