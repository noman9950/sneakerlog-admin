import React from 'react';
import {Link} from 'react-router-dom';
import moment from 'moment';
import {getSneakersReleaseDates, deleteSneakersReleaseDate} from "../backend/services/sneakerReleaseService";
import SnackBar from "../components/SnackBar";
import Swal from "sweetalert2"
import {deleteMultiple} from "../backend/services/usersService";
import {Pagination} from "react-bootstrap";

export default class Sneakers extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sneakers: [],
            activePage: 0,
            pages: 0,
            perPage: 20,
            q: '',
            loading: true,
            responseMessage: 'Loading Sneakers Release Dates...',
            showSnackBar: false,
            snackBarMessage: "",
            snackBarVariant: "success"
        }
    }

    componentWillMount() {
        this.fetchData();
    }

    fetchData = () => {
        this.setState({loading: true})
        getSneakersReleaseDates()
            .then(response => {

                response = response.map((r, index) => {
                    r.checked = false;
                    r.index = index + 1;
                    r.formatted_releaseDate = r.releaseDate.seconds;
                    return r;
                })


                this.setState({
                    sneakers: response,
                    loading: false,
                    pages: Math.ceil(response.length / this.state.perPage),
                    activePage: 1,
                    responseMessage: 'No Sneakers Release Dates Found'
                })
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    responseMessage: 'No Sneakers Release Dates Found...'
                })
            })
    }
    fetchDataPrew = (a) => {
        this.setState({loading: true})
        getSneakersReleaseDates()
            .then(response => {

                response = response.map((r, index) => {
                    r.checked = false;
                    r.index = index + 1;
                    r.formatted_releaseDate = r.releaseDate.seconds;
                    return r;
                })


                this.setState({
                    sneakers: response,
                    loading: false,
                    pages: Math.ceil(response.length / this.state.perPage),
                    activePage: a-1,
                    responseMessage: 'No Sneakers Release Dates Found'
                })
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    responseMessage: 'No Sneakers Release Dates Found...'
                })
            })
    }
    fetchDataNext = (a) => {
        this.setState({loading: true})
        getSneakersReleaseDates()
            .then(response => {

                response = response.map((r, index) => {
                    r.checked = false;
                    r.index = index + 1;
                    r.formatted_releaseDate = r.releaseDate.seconds;
                    return r;
                })


                this.setState({
                    sneakers: response,
                    loading: false,
                    pages: Math.ceil(response.length / this.state.perPage),
                    activePage: a+1,
                    responseMessage: 'No Sneakers Release Dates Found'
                })
            })
            .catch(() => {
                this.setState({
                    loading: false,
                    responseMessage: 'No Sneakers Release Dates Found...'
                })
            })
    }

    deleteSneaker(sneakerId, index) {
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
                deleteSneakersReleaseDate(sneakerId)
                    .then(response => {
                        const sneakers = this.state.sneakers.slice();
                        sneakers.splice(index, 1);
                        this.setState({
                            sneakers,
                            showSnackBar: true,
                            snackBarMessage: "Sneaker Release deleted successfully",
                            snackBarVariant: "success",
                        })
                    })
                    .catch(() => {
                        this.setState({
                            showSnackBar: true,
                            snackBarMessage: "Error deleting sneaker release",
                            snackBarVariant: "error",
                        });
                    })
            }
        })
    }


    handleSelect(page) {
        const activePage = this.state.activePage;
        if (page !== activePage) {
            this.setState({activePage: page})
        }
    }

    handleSelectSneaker = (index) => {
        const sneakerList = this.state.sneakers;
        sneakerList[index].checked = !sneakerList[index].checked;
        this.setState({sneakers: sneakerList});
    }

    handleDeleteSneaker = async (e) => {
        const sneakerList = this.state.sneakers;
        const sneakersToDelete = (sneakerList).filter((sneaker) => sneaker.checked);
        this.setState({loading: true, responseMessage: "Deleting sneakers", sneakers: []})
        await deleteMultiple(sneakersToDelete, "SneakersReleaseDates");
        const filteredSneaker = (sneakerList).filter((sneaker) => !sneaker.checked).map((sneaker, index) => {
            sneaker.index = index + 1;
            return sneaker;
        });
        this.setState({
            loading: false, sneakers: filteredSneaker, responseMessage: "",
            pages: Math.ceil(filteredSneaker.length / this.state.perPage),
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

    // handleSearch() {
    //   const { q } = this.state;
    //   if(q.length) {
    //   this.setState({loading: true, sneakers: [], responseMessage: 'Loading Sneakers...'})
    //   // if(q === "") {
    //   //   this.fetchBrand();
    //   // } else {
    //     axios.get(`${API_END_POINT}/api/items/sneaker/search`, {params: {"searchWord": this.state.q}, headers: {"auth-token": token}})
    //     .then((response) => {
    //       this.setState({
    //         sneakers: response.data.searchedItems,
    //         loading: false,
    //         responseMessage: 'No Sneakers Found...'
    //       })
    //     })
    //     .catch(() => {
    //       this.setState({
    //         loading: false,
    //         responseMessage: 'No Sneakers Found...'
    //       })
    //     })
    //   }
    // }

    closeSnackBar = () => {
        this.setState({showSnackBar: false})
    }

    render() {
        const {
            loading, responseMessage,
            showSnackBar,
            snackBarMessage,
            snackBarVariant,
            searchBy, activePage, perPage

        } = this.state;

        let sneakers = JSON.parse(JSON.stringify(this.state.sneakers));
        const page = activePage - 1;

        if (searchBy) {
            if (searchBy.orderBy === "asc") {
                sneakers = sneakers.sort(function (a, b) {
                    return ('' + a[searchBy.label]).localeCompare(b[searchBy.label], undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    })
                        ;
                });
            } else {
                sneakers = sneakers.sort(function (a, b) {
                    return ('' + b[searchBy.label]).localeCompare(a[searchBy.label], undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    })
                });
            }
        }

        sneakers=sneakers.map((sneaker,index)=>{
            sneaker.index=index+1
            return sneaker;
        })


        let paginatedSneakers = JSON.parse(JSON.stringify(sneakers)).slice((page) * perPage, (page + 1) * perPage);
        let checkedSneakers = paginatedSneakers.filter((sneaker) => sneaker.checked);

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
                            <h3>List of Sneakers Release</h3>
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
                      this.fetchBrand();
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
                            {checkedSneakers.length > 0 &&
                            <button type="button" className="btn btn-danger" onClick={this.handleDeleteSneaker}>Delete Sneakers</button>
                            }
                            <Link to="/sneakers/sneakers-form">
                                <button type="button" className="btn btn-success" style={{marginLeft: "10px"}}>Add New
                                    Sneakers Release
                                </button>
                            </Link>
                        </div>

                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>Sr. #</th>
                                <th>Name <span onClick={(e) => this.onHandleSearch("name", false)}><img
                                        style={{height: "15px"}} src={"././img/descendant.png"}/></span></th>
                                <th>Image</th>
                                <th>Release Date <span
                                    onClick={(e) => this.onHandleSearch("formatted_releaseDate", true)}><img
                                    style={{height: "15px"}} src={"././img/descendant.png"}/></span></th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* {paginatedSneakers && paginatedSneakers.length >= 1 ? */}
                            {this.state.loading==false?
                                paginatedSneakers.map((sneaker, index) => (
                                    <tr key={index}>
                                        <td>
                                           <span>
                                            <input type={"checkbox"} checked={sneaker.checked}
                                                   onChange={(e) => this.handleSelectSneaker(sneaker.index - 1)}/>
                                        </span> {sneaker.index}
                                        </td>
                                        <td>{sneaker.name}</td>
                                        <td>{<img style={{height: '50px', width: '50px'}} src={sneaker.image}/>}</td>
                                        <td>{moment(new Date(sneaker.releaseDate.seconds * 1000)).format("DD-MMM-YYYY")}</td>
                                        <td>
                                            <Link to={`/sneakers/edit-sneakers/${sneaker.uuid}`}>
                                                <span className="fa fa-edit" aria-hidden="true"></span>
                                            </Link>
                                        </td>
                                        <td>
                                            <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true"
                                                  onClick={() => this.deleteSneaker(sneaker.uuid, index)}></span>
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
                                            <Pagination.Prev disabled={this.state.activePage>1?false:true}  onClick={()=>{this.fetchDataPrew(this.state.activePage)}}/>
                                            <Pagination.Next disabled={this.state.activePage<this.state.pages?false:true} onClick={()=>{this.fetchDataNext(this.state.activePage)}}/>
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
