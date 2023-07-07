import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Pagination} from 'react-bootstrap';
import {getUsers, deleteUser, deleteMultiple} from "../backend/services/usersService";
// import {signInWithEmail} from "../backend/services/authService";
import SnackBar from "../components/SnackBar";
import Swal from "sweetalert2";

import {API_END_POINT} from '../config';
import Cookie from 'js-cookie';
import Grid from "@material-ui/core/Grid/Grid";
import { Button } from 'reactstrap';

const token = Cookie.get('sneakerlog_access_token');


export default class Users extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: [],
            activePage: 0,
            pages: 0,
            perPage:20,
            q: '',
            loading: false,
            responseMessage: 'Loading Users...',
            showSnackBar: false,
            snackBarMessage: "",
            snackBarVariant: "success",
            searchBy: null
        }
    }
  
    componentWillMount() {
        // signInWithEmail('arslan@gmail.com', "123456")
        // .then((response) => {
        //   console.log("response", response)
        // })
        // .catch((error) => {
        //   console.log("error", error)
        // })
        this.fetchUsers();
    }

    fetchUsers = () => {
        getUsers()
            .then(response => {
                console.log(response,"kkkkkkkkkkkkkkk")
                response = response.map((r,index) => {
                    r.checked = false;
                    r.index=index+1;
                    return r;
                })
                this.setState({
                    users: response,
                    pages: Math.ceil(response.length/this.state.perPage),
                    activePage:1,
                    loading: false,
                    responseMessage: 'No Users Found'
                })
            })
            .catch((err) => {
                this.setState({
                    loading: false,
                    responseMessage: 'No Users Found...'
                })
            })
    }
    fetchUsers1 = (a) => {
        console.log(a,"click")
        // this.setState({loading:true})
        getUsers()
            .then(response => {
                console.log(response,a,"kkkkkkkkkkkkkkk1111111")
                response = response.map((r,index) => {
                    r.checked = false;
                    r.index=index+1;
                    return r;
                })
                this.setState(
                
                    {
                    users: response,
                    pages: Math.ceil(response.length/this.state.perPage),
                    activePage:a+1,
                    loading: false,
                    responseMessage: 'No Users Found'
                })
            })
            .catch((err) => {
                this.setState({
                    loading: false,
                    responseMessage: 'No Users Found...'
                })
            })
    }
    fetchUsers2 = (a) => {
        console.log(a,"click")
        // this.setState({loading:true})
        getUsers()
            .then(response => {
                console.log(response,a,"kkkkkkkkkkkkkkk1111111")
                response = response.map((r,index) => {
                    r.checked = false;
                    r.index=index+1;
                    return r;
                })
                this.setState(
                
                    {
                    users: response,
                    pages: Math.ceil(response.length/this.state.perPage),
                    activePage:a-1,
                    loading: false,
                    responseMessage: 'No Users Found'
                })
            })
            .catch((err) => {
                this.setState({
                    loading: false,
                    responseMessage: 'No Users Found...'
                })
            })
    }
    removeUser(userId, index) {
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
                deleteUser(userId)
                    .then(response => {
                        const users = this.state.users.slice();
                        users.splice(index, 1);
                        this.setState({
                            users,
                            showSnackBar: true,
                            snackBarMessage: "User deleted successfully",
                            snackBarVariant: "success",
                        });
                    })
                    .catch(() => {
                        this.setState({
                            showSnackBar: true,
                            snackBarMessage: "Error deleting user",
                            snackBarVariant: "error",
                        });
                    })
            }
        })
    }
    handleSelect (p){
        console.log(p,"pagesssssssss")
        // const activePage=this.state.activePage;
        // if(page!==activePage){
        //     this.setState({activePage:page})
        // }
    }

    handleSearch() {
        axios.get(`/api/area?q=${this.state.q}`)
            .then((response) => {
                this.setState({
                    areas: response.data.items,
                    activePage: 1,
                    pages: Math.ceil(response.data.total / 10)
                })
            })
    }

    handleSearch() {
        const {q} = this.state;
        if (q.length) {
            this.setState({loading: true, users: [], responseMessage: 'Loading Users...'})
            axios.get(`${API_END_POINT}/api/users/search`, {
                params: {"searchWord": this.state.q},
                headers: {"auth-token": token}
            })
                .then((response) => {
                    this.setState({
                        users: response.data.searchedItems,
                        loading: false,
                        responseMessage: 'No Users Found...'
                    })
                })
                .catch(() => {
                    this.setState({
                        loading: false,
                        responseMessage: 'No Users Found...'
                    })
                })
        }
    }

    closeSnackBar = () => {
        this.setState({showSnackBar: false})
    }

    onHandleSearch = (type) => {
        let searchBy = this.state.searchBy;
        if (searchBy) {
            if (searchBy.label === type) {
                this.setState({searchBy: {label: type, orderBy: searchBy.orderBy === "asc" ? "desc" : "asc"},activePage:0});
            } else {
                this.setState({searchBy: {label: type, orderBy: "desc"},activePage:0});
            }
        } else {
            this.setState({searchBy: {label: type, orderBy: "desc",activePage:0}});

        }
    }

    handleSelectUser = (index) => {
        const usersList = this.state.users;
        usersList[index].checked = !usersList[index].checked;
        this.setState({users: usersList});
    }


    handleDeleteUsers = async (e) => {
        const usersList = this.state.users;
        const usersToDelete = (usersList).filter((user) => user.checked);
        this.setState({loading: true, responseMessage: "Deleting users", users: []})
        await deleteMultiple(usersToDelete,"Users");
        const filteredUsers = (usersList).filter((user) => !user.checked).map((user,index)=>{
            user.index=index+1;
            return user;
        });
        this.setState({loading: false, users: filteredUsers,responseMessage: "",
            pages: Math.ceil(filteredUsers.length/this.state.perPage)});

    }


    render() {



        let {
            loading, responseMessage,
            showSnackBar,
            snackBarMessage,
            snackBarVariant,
            searchBy,activePage,perPage,
        } = this.state;
        let users=JSON.parse(JSON.stringify(this.state.users));
        const page=activePage-1;


        if (searchBy) {
            if (searchBy.orderBy === "asc") {
                users = users.sort(function (a, b) {
                    return ('' + a[searchBy.label]).localeCompare(b[searchBy.label], undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    });
                });
            } else {
                users = users.sort(function (a, b) {
                    return ('' + b[searchBy.label]).localeCompare(a[searchBy.label], undefined, {
                        numeric: true,
                        sensitivity: 'base'
                    });
                });
            }
        }


        users=users.map((user,index)=>{
            user.index=index+1
            return user;
        })

        let paginatedUsers=JSON.parse(JSON.stringify(users)).slice((page)*perPage,(page+1)*perPage);
        let checkedUsers = paginatedUsers.filter((user) => user.checked);
        console.log(users,paginatedUsers,"iiiiiiiiiii")
        let test="false"
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
                            <h3>List of Users</h3>
                        </div>
                        <div className="col-sm-4">
                            {/* <div className='input-group'>
                <input
                  onChange={(event) => this.setState({q: event.target.value}, () => {
                    if(this.state.q === "") {
                      this.fetchUsers();
                    }
                  })}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      this.handleSearch();
                    }
                  }}
                  className='form-control' type="text" name="search" placeholder="Enter search keyword"
                  value={this.state.q}
                  // onChange={(event) => this.setState({ q: event.target.value })}
                />
                <span className="input-group-btn">
                  <button type="button" onClick={() => this.handleSearch()}
                          className="btn btn-info search-btn">Search</button>
                </span>
              </div> */}
                        </div>
                        <div className="col-sm-4 pull-right mobile-space">
                            {checkedUsers.length > 0 &&
                            <button type="button" className="btn btn-danger" onClick={this.handleDeleteUsers}>Delete
                                Users</button>
                            }
                            <Link to='/users/user-form' style={{marginLeft: "10px"}}>
                                <button type="button" className="btn btn-success">Add new User</button>
                            </Link>
                        </div>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>Sr. #</th>
                                <th>Image</th>
                                <th>Name <span onClick={(e) => this.onHandleSearch("name")}><img
                                    style={{height: "15px"}} src={"././img/descendant.png"}/></span>
                                </th>
                                <th>Username <span onClick={(e) => this.onHandleSearch("username")}><img
                                    style={{height: "15px"}} src={"././img/descendant.png"}/></span>
                                </th>
                                <th>Phone</th>
                                <th>No. of Collections <span onClick={(e) => this.onHandleSearch("collections")}><img
                                    style={{height: "15px"}}
                                    src={"././img/descendant.png"}/></span></th>
                                <th>Size <span onClick={(e) => this.onHandleSearch("size")}><img
                                    style={{height: "15px"}} src={"././img/descendant.png"}/></span>
                                </th>
                                <th>Exports <span onClick={(e) => this.onHandleSearch("exports")}><img
                                    style={{height: "15px"}} src={"././img/descendant.png"}/></span></th>
                                <th>Sneaker Count <span onClick={(e) => this.onHandleSearch("sneakerCount")}><img
                                    style={{height: "15px"}} src={"././img/descendant.png"}/></span></th>
                                <th>Sneaker Scans  <span onClick={(e) => this.onHandleSearch("sneakerScans")}><img
                                    style={{height: "15px"}} src={"././img/descendant.png"}/></span></th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* {paginatedUsers.length >= 1 ? */}
                            {console.log(this.state.loading,"check")}
                            {this.state.loading==false?
                           (  paginatedUsers.length >= 1  ?
                                paginatedUsers.map((user, index) => (
                                    <tr key={index}>
                                        {console.log(user,"usertest")}
                                        <td><span>
                                            <input type={"checkbox"} checked={user.checked}
                                                   onChange={(e) => this.handleSelectUser(user.index-1)}/>
                                        </span> {user.index}</td>
                                        <td>{<img style={{height: '50px', width: '50px'}}
                                                  src={user.profileImage}/>}</td>
                                        <td>{user.name}</td>
                                        <td>{user.username}</td>
                                        <td>{user.phone}</td>
                                        <td>{user.collections}</td>
                                        <td>{user.size}</td>
                                        <td>{user.exports}</td>
                                        <td>{user.sneakerCount}</td>
                                        <td>{user.sneakerScans}</td>
                                        <td>
                                            <Link to={`/users/edit-user/${user.uuid}`}>
                                                <span className="fa fa-edit" aria-hidden="true"></span>
                                            </Link>
                                        </td>
                                        <td>
                                            <span className="fa fa-trash" style={{cursor: 'pointer'}} aria-hidden="true"
                                                  onClick={() => this.removeUser(user.uuid, index)}></span>
                                        </td>
                                    </tr>
                                )) :

                                (
                                    <tr>
                                        <td colSpan="15" className="text-center">{responseMessage}</td>
                                    </tr>
                                )
                           )
                            :  (
                                <tr>
                                    <td colSpan="15" className="text-center">{responseMessage}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                    {/* {this.state.pages>0 && */}
                        <div className="text-center">
                            {/* <Button>aa</Button> */}
                            {/* {console.log(this.state.pages,"pages")} */}
                            <Pagination>
                                            <Pagination.Prev disabled={this.state.activePage>1?false:true}  onClick={()=>{this.setState({loading:true,responseMessage:"Loading data"});this.fetchUsers2(this.state.activePage)}}/>
                                            {/* <Pagination.Item/> */}
                                            <Pagination.Next disabled={this.state.activePage<this.state.pages?false:true} onClick={()=>{this.setState({loading:true,responseMessage:"Loading data"});this.fetchUsers1(this.state.activePage)}}/>
                                        </Pagination>
                                        {/* <Pagination>{"abc"}</Pagination> */}
                        </div>
                    {/* } */}
                </div>
            </div>
        );
    }
}