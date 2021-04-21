import React from 'react';
import { Redirect } from 'react-router-dom';

class Login extends React.Component {
	constructor() {
		super();
		this.state = {
			username: '',
			password: '',
			error: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		const name = event.target.name;
		this.setState({
			[name]: event.target.value
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		axios.post('/api/signin', {
			username: this.state.username,
			password: this.state.password
		})
		.then((response) => {
			this.setState({ error: '' });
			const token = response.data.token;
			const user = response.data.user;
			this.props.authenticate(token, user);
		})
		.catch((error) => {
			const status = error.response.status;
			// if (status === 401) {
				this.setState({ error: 'Username or password not recognised.' });
			// }
		});
	}

	render() {
		if (this.props.isAuthenticated) {
			return (
				<Redirect to={'/'} />
			);
		}
		return (
			<div className="container py-4">
				<h1>Login</h1>
				{this.state.error !== '' ?
					<p className="text-danger">{this.state.error}</p>
					:
					null
				}
				{this.props.isAuthenticated ?
					<p className="text-info">You are already logged in.</p>
					:
					<form onSubmit={this.handleSubmit}>
						<div className='form-group'>
							<input
								name='username'
								type='username'
								className='form-control' 
								placeholder='Username'
								value={this.state.username}
								onChange={this.handleChange} />
						</div>
						<div className='form-group'>
							<input 
								name='password'
								type='password' 
								className='form-control' 
								placeholder='Password'
								value={this.state.password}
								onChange={this.handleChange} />
						</div>
						<div className='form-group'>
							<input type='submit' className='btn' value='Login' />
						</div>
					</form>	
				}
			</div>
		);
	}
}

export default Login;