import React from 'react';
import { Redirect } from 'react-router-dom';
import Swal from 'sweetalert2'

class Users extends React.Component {
	constructor() {
		super();
		this.state = {
			users: [],
			errors: {},
			user: {
				username: '',
				email: '',
				first_name: '',
				last_name: '',
				contact_phone_number: '',
				post_code: '',
				post_code: '',
				role: '',
			},
			formTitle: '',
			submitUrl: '',
			pwRequired: false,
			deleteIds: [],
		};

		this.init = this.init.bind(this);
		this.delete = this.delete.bind(this);
		this.requestDelete = this.requestDelete.bind(this);
		this.submitUpdate = this.submitUpdate.bind(this);
		this.create = this.create.bind(this);
		this.edit = this.edit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleCheck = this.handleCheck.bind(this);
		this.multipleDelete = this.multipleDelete.bind(this);
	}

	init() {
		axios.post('/api/fetch-users')
		.then((response) => {
			const data = response.data;
			this.setState({
				users: data.users,
			});
		})
		.catch((error) => {
			console.log(error.response);
		});
	}

	delete(id) {
		Swal.fire({
			title: 'Are you sure?',
			text: "You are about to delete user #" + id,
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				this.requestDelete([id]);
			}
		})
	}

	multipleDelete() {
		Swal.fire({
			title: 'Are you sure?',
			text: "You are about to delete multiple users (" + this.state.deleteIds.length + ")",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				this.requestDelete(this.state.deleteIds);
				this.setState({
					deleteIds: [],
				});
			}
		})
	}

	submitUpdate(e) {
		e.preventDefault();
        
        this.setState({
			errors: {},
		});

		let form = event.target;
        let params = new FormData(form);

        axios.post(this.state.submitUrl, params)
        .then(response => {
        	let message = response.data.message;
        	this.init();
        	$('#formModal').modal('hide');

        	Swal.fire({
			  icon: 'success',
			  title: message,
			  timer: 1500
			});
        }).catch(error => {
        	const errors = error.response.data.errors;
        	let html = this.props.parseErrors(errors);
        	Swal.fire({
				icon: 'error',
				title: 'Oops...',
				html: html,
			});
        });
	}

	edit(user) {
		this.setState({
			user: user,
			formTitle: 'Edit User #' + user.id,
			submitUrl: '/api/update-users',
			pwRequired: false,
		});
	}

	create() {
		this.setState({
			user: {
				username: '',
				email: '',
				first_name: '',
				last_name: '',
				contact_phone_number: '',
				post_code: '',
				post_code: '',
				role: '',
			},
			formTitle: 'Create User',
			submitUrl: '/api/create-users',
			pwRequired: true,
		});
	}

	requestDelete(ids = []) {
		axios.post('/api/delete-users', {
			ids: ids,
		}).then((response) => {
			this.init();
		})
		.catch((error) => {
			console.log(error.response);
		});
	}

	componentWillMount() {
		this.init();
	}

	handleChange(event) {
		const target = event.target;
	    const value = target.type === 'checkbox' ? target.checked : target.value;
	    const name = target.name;

	    let user = this.state.user;
	    user[name] = value;

	    this.setState({
	    	user: user,
	    });
	}

	handleCheck(event) {
        let isChecked = event.target.checked;
        let item = parseInt(event.target.value);
        let deleteIds = this.state.deleteIds;

        const index = deleteIds.indexOf(item);

        if (index > -1) {
		 	deleteIds.splice(index, 1);
		}else {
        	deleteIds.push(item);
		}

        this.setState({
        	deleteIds: deleteIds,
        });
        
  	}

	render() {
		if (!this.props.isAuthenticated || this.props.user.role != 'admin') {
			return (
				<Redirect to={'/'} />
			);
		}

		return (
			<div className="container py-4">
				<div className="row">
					<div className="col-6">
		    			<h1>Users</h1>
					</div>
					<div className="col-6 text-right">
						<button 
							className="ml-2 btn btn-success" 
							title="Create"
							data-toggle="modal" data-target="#formModal"
							onClick={this.create}
						>
							<i className="fas fa-plus"></i> Create User
						</button>
						<button 
							className="ml-2 btn btn-danger" 
							title="Delete"
							onClick={this.multipleDelete}
							disabled={!this.state.deleteIds.length}
						>
							<i className="fas fa-trash-alt"></i> Delete ({this.state.deleteIds.length})
						</button>
					</div>
				</div>	

				<table className="table table-bordered">
					<thead>
						<tr>
							<th scope="col">Select</th>
							<th scope="col">#</th>
							<th scope="col">First Name</th>
							<th scope="col">Last Name</th>
							<th scope="col">Username</th>
							<th scope="col">Email</th>
							<th scope="col">Action</th>
						</tr>
					</thead>
					<tbody>
						{this.state.users.map((user, key) => {
							return <tr key={key}>

								<td><input type="checkbox" value={user.id} onChange={this.handleCheck} /></td>
								<td>{user.id}</td>
								<td>{user.first_name}</td>
								<td>{user.last_name}</td>
								<td>{user.username}</td>
								<td>{user.email}</td>
								<td>
									<button 
										className="ml-2 btn btn-sm btn-primary" 
										title="Edit"
										data-toggle="modal" data-target="#formModal"
										onClick={() => this.edit(user)}
									>
										<i className="fas fa-pencil"></i>
									</button>
									<button 
										className="ml-2 btn btn-sm btn-danger" 
										title="Delete"
										onClick={() => this.delete(user.id)}
									>
										<i className="fas fa-trash-alt"></i>
									</button>
								</td>

							</tr>
						})}
							
					</tbody>
				</table>


				<div className="modal fade" id="formModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title" id="exampleModalCenterTitle">{this.state.formTitle}</h5>
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								  	<span aria-hidden="true">&times;</span>
								</button>
							</div>
						    <form onSubmit={this.submitUpdate}>
						    	<input name="id" defaultValue={this.state.user.id} hidden/>
								<div className="modal-body">
									    <div className="row">
									        <div className="col-6">
									            <div className="form-group">
									                <label htmlFor="username">Username <b className="text-danger">*</b></label>
									                <input 
									                	type="text" 
									                	name="username" 
									                	id="username" 
									                	className="form-control" 
									                	value={this.state.user.username ? this.state.user.username : ''}
									                	onChange={this.handleChange} 
								                	/>
									            </div>
									        </div> 
									        <div className="col-6">
									            <div className="form-group">
									                <label htmlFor="email">Email <b className="text-danger">*</b></label>
									                <input 
									                	type="text" 
									                	name="email" 
									                	id="email" 
									                	className="form-control" 
									                	value={this.state.user.email ? this.state.user.email : ''}
									                	onChange={this.handleChange}  
								                	/>
									            </div>
									        </div> 
									        <div className="col-6">
									            <div className="form-group">
									                <label htmlFor="first_name">First Name <b className="text-danger">*</b></label>
									                <input 
									                	type="text" 
									                	name="first_name" 
									                	id="first_name" 
									                	className="form-control" 
									                	value={this.state.user.first_name ? this.state.user.first_name : ''}
									                	onChange={this.handleChange}  
								                	/>
									            </div>
									        </div> 
									        <div className="col-6">
									            <div className="form-group">
									                <label htmlFor="last_name">Last Name <b className="text-danger">*</b></label>
									                <input 
									                	type="text" 
									                	name="last_name" 
									                	id="last_name" 
									                	className="form-control" 
									                	value={this.state.user.last_name ? this.state.user.last_name : ''}
									                	onChange={this.handleChange}  
								                	/>
									            </div>
									        </div> 
									        <div className="col-6">
									            <div className="form-group">
									                <label htmlFor="contact_phone_number">Contact No.</label>
									                <input 
									                	type="text" 
									                	name="contact_phone_number" 
									                	id="contact_phone_number" 
									                	className="form-control" 
									                	value={this.state.user.contact_phone_number ? this.state.user.contact_phone_number : ''}
									                	onChange={this.handleChange}  
								                	/>
									            </div>
									        </div> 
									        <div className="col-6">
									            <div className="form-group">
									                <label htmlFor="post_code">Post Code</label>
									                <input 
									                	type="text" 
									                	name="post_code" 
									                	id="post_code" 
									                	className="form-control" 
									                	value={this.state.user.post_code ? this.state.user.post_code : ''}
									                	onChange={this.handleChange}  
								                	/>
									            </div>
									        </div> 
									        <div className="col-12">
									            <div className="form-group">
									                <label htmlFor="address">Address</label>
									                <input 
									                	type="text" 
									                	name="address" 
									                	id="address" 
									                	className="form-control" 
									                	value={this.state.user.address ? this.state.user.address : ''}
									                	onChange={this.handleChange}  
								                	/>
									            </div>
									        </div> 
									        <div className="col-6">
									            <div className="form-group">
									                <label htmlFor="role">Role</label>
									                <select 
									                	name="role" 
									                	id="role" 
									                	className="form-control"
									                	value={this.state.user.role ? this.state.user.role : ''}
									                	onChange={this.handleChange} 
								                	>
								                		<option value="user">user</option>
								                		<option value="admin">admin</option>
								                	</select>

									            </div>
									        </div>

									        {this.state.pwRequired ? 
								        	<div className="row col-12">

									        	<div className="col-6">
										            <div className="form-group">
										                <label htmlFor="password">Password <b className="text-danger">*</b></label>
										                <input 
										                	type="password" 
										                	name="password" 
										                	id="password" 
										                	className="form-control" 
										                	value={this.state.user.password ? this.state.user.password : ''}
										                	onChange={this.handleChange}  
									                	/>
										            </div>
										        </div> 

										        <div className="col-6">
										            <div className="form-group">
										                <label htmlFor="password_confirmation">Confirm Password <b className="text-danger">*</b></label>
										                <input 
										                	type="password" 
										                	name="password_confirmation" 
										                	id="password_confirmation" 
										                	className="form-control" 
										                	value={this.state.user.password_confirmation ? this.state.user.password_confirmation : ''}
										                	onChange={this.handleChange}  
									                	/>
										            </div>
										        </div> 

								        	</div>
									        : null }

									    </div>
								</div>
								<div className="modal-footer">
									<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
									<button type="submit" className="btn btn-primary">Save changes</button>
								</div>
							</form>
						</div>
					</div>
				</div>

			</div>
		);
	}
}

export default Users;