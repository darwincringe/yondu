import React from 'react';
import Home from './Home';
import Clients from './Clients';
import Login from './Login';
import { HashRouter, Route, Switch, NavLink, Redirect } from 'react-router-dom';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
			isAuthenticated: false,
			token: null,
			user: {},
		};
		this.logout = this.logout.bind(this);
		this.authenticate = this.authenticate.bind(this);
    }

    componentWillMount() {
		const lsToken = localStorage.getItem('jwt'); 
		const user = localStorage.getItem('user'); 

		if (lsToken) {

			this.authenticate(lsToken, JSON.parse(user));
		}
	}

	authenticate(token, user = '') {
		this.setState({
			isAuthenticated: true,
			token: token
		});
		localStorage.setItem('jwt', token);
		
		if(user) {
			this.setState({
				user: user
			});
			localStorage.setItem('user', JSON.stringify(user));
		}
	}

	logout() {
		this.setState({
			isAuthenticated: false,
			token: null,
			user: {},
		});
		localStorage.removeItem('jwt');
		localStorage.removeItem('user');
	}

	refresh() {
		return axios.get('/api/profile', {
			headers: { 'Authorization': 'Bearer ' + this.state.token }
		})
		.then((response) => {
			// const token = response.data.token;
			// this.authenticate(token);
		})
		.catch((error) => {
			console.log('Error!', error);
		});
	}

    render() {
        return (
            <HashRouter>
			    <div>
			        <Menu isAuthenticated={this.state.isAuthenticated} logout={this.logout} />
			        <Switch>
			            <Route exact path='/' component={Home} />
			            <Route exact path='/login' render={(props) => <Login authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated} {...props} />} />
			            <PrivateRoute exact path='/clients' component={Clients} isAuthenticated={this.state.isAuthenticated} token={this.state.token} refresh={this.refresh} />
			        </Switch>
			    </div>
			</HashRouter>
        );
    }
}

const PrivateRoute = ({ component: Component, isAuthenticated, token, ...rest }) => (
	<Route {...rest} render={props => (
		isAuthenticated ? (
			<Component {...props} {...rest} token={token} isAuthenticated={isAuthenticated} />
		) : (
			<Redirect to={{
				pathname: '/login',
				state: { from: props.location }
			}} />
		)
	)} />
);

const Menu = (props) => (
	<nav className="navbar navbar-expand-md navbar-light bg-white shadow-sm">
		<div className="container">
            <a className="navbar-brand" href="#">
                Yondu
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
            	<ul className="navbar-nav mr-auto">
                    <li className="nav-item">
	                    <NavLink exact className="nav-link" activeClassName="active" to="/">
		               		Home
		           		</NavLink>
                    </li>
                    <li className="nav-item">
	                    <NavLink exact className="nav-link" activeClassName="active" to="/clients">
		               		Users
		           		</NavLink>
                    </li>
                </ul>
                {<ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <a className="nav-link" href="#"></a>
                    </li>

                    {props.isAuthenticated ?
                	<li className="nav-item dropdown">
                        <a id="navbarDropdown" className="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            My Account <span className="caret"></span>
                        </a>

                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                            <a className="dropdown-item" href="#" onClick={props.logout}>
                                Logout
                            </a>

                        </div>
                    </li>
                    : 
                    <li className="nav-item">
	                    <NavLink exact className="nav-link" activeClassName="active" to="/login">
		               		Login
		           		</NavLink>
                    </li>
                	}
                    
                </ul>}
			</div>
		</div>
	</nav>
);

export default App;