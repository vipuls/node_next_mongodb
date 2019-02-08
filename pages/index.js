import { Component } from 'react';
import PropTypes from 'prop-types';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import withRedux from 'next-redux-wrapper';
import reduxApi from '../lib/reduxApi';

import PageHead from '../components/PageHead';

class IndexPage extends Component {

	static propTypes = {

		// oneKitten: PropTypes.shape({
		// 	loading: PropTypes.bool.isRequired,
		// 	data: PropTypes.shape({
		// 		text: PropTypes.string
		// 	}).isRequired
		// }).isRequired,

		users: PropTypes.shape({
			loading: PropTypes.bool.isRequired,
			data: PropTypes.array.isRequired
		}).isRequired,

		dispatch: PropTypes.func.isRequired

	};


	constructor (props) {
		super(props)
		this.state = { email: '' }
	}

	handleChangeInputText (event) {
		this.setState({ email: event.target.value });
	}



	handleSelect  (event) {
    this.setState({ inProgress: true });
	const callbackWhenDone = () => console.log('hi'); this.setState({ email: '', inProgress: null });
	const newUser = {
			email: this.state.email,
			password: this.state.password
		};

		//const users = await store.dispatch(reduxApi.actions.users.sync());
		//console.log(users);



		//console.log(this.state.email);
//this.props.dispatch(reduxApi.actions.users.sync({ body: JSON.stringify(newUser) }, callbackWhenDone));

this.props.dispatch(reduxApi.actions.users.get({ email : this.state.email, password : this.state.email}, callbackWhenDone));
//{ id: userId }, { body: JSON.stringify(newUser) }
//const userArray  =  this.props.dispatch(reduxApi.actions.userlogin.sync({email:this.state.email,password:this.state.password}));
//console.log(userArray);
//console.log(JSON.stringify(userArray));
//var userdata = JSON.parse(userArray);
//console.log(userdata.props.users.data);
	}

	render () {

	

		return <div>
			<PageHead
				title='User Login'
				description='Demo of User Login'
			/>

			<h1>Login</h1>
			
				<ul>
					<li><input placeholder='Enter a email address' value={this.state.email} onChange={this.handleChangeInputText.bind(this)}/></li>
					<li><input placeholder='Enter a password' value={this.state.password} onChange={this.handleChangeInputText.bind(this)}/></li>
					<li><button onClick={this.handleSelect.bind(this)} disabled={this.state.inProgress}>Login</button></li>
				</ul>
			
			
			
		</div>
	};

}

const createStoreWithThunkMiddleware = applyMiddleware(thunkMiddleware)(createStore);
const makeStore = (reduxState, enhancer) => createStoreWithThunkMiddleware(combineReducers(reduxApi.reducers), reduxState);
const mapStateToProps = (reduxState) => ({ users: reduxState.userlogin }); // Use reduxApi endpoint names here

const IndexPageConnected = withRedux({ createStore: makeStore, mapStateToProps })(IndexPage)
export default IndexPageConnected;
