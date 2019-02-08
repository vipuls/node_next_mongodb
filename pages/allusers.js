import { Component } from 'react';
import PropTypes from 'prop-types';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import withRedux from 'next-redux-wrapper';
import reduxApi from '../lib/reduxApi';

import PageHead from '../components/PageHead';
import UserItem from '../components/UserItem';

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

	static async getInitialProps ({store, isServer, pathname, query}) {
		// Get all kittens
		const users = await store.dispatch(reduxApi.actions.users.sync());
	//	//console.log(users);
		//const users = [];
		return { users };
	}

	constructor (props) {
		super(props)
		this.state = { email: '' , password : ''}
	}

	handleChangeInputText (event) {
		this.setState({ email: event.target.value , password : event.target.value });
	}

	handleAdd (event) {
		// Progress indicator
		this.setState({ inProgress: true });
		const callbackWhenDone = () => this.setState({ email: '', inProgress: null });

		// Actual data request
		const newUser = {
			email: this.state.email,
			password: this.state.password,
		};
		this.props.dispatch(reduxApi.actions.users.post({}, { body: JSON.stringify(newUser) }, callbackWhenDone));
	}

	handleUpdate (index, userId, email,password, event) {
		// Progress indicator
		this.setState({ inProgress: userId });
		const callbackWhenDone = () => this.setState({ inProgress: null });

		this.state = { email: email , password : password}
		
		// Actual data request
		const newUser = {
			email: prompt(''),
			//password: prompt(),
		};

		this.props.dispatch(reduxApi.actions.users.put({ id: userId }, { body: JSON.stringify(newUser) }, callbackWhenDone));
	}

	handleDelete (index, userId, event) {
		// Progress indicator
		this.setState({ inProgress: userId });
		const callbackWhenDone = () => this.setState({ inProgress: null });

		// Actual data request
		this.props.dispatch(reduxApi.actions.users.delete({ id: userId }, callbackWhenDone));
	}

	render () {

		const {users} = this.props;//dd
		//console.log(users);
		const userList = users.data
			? users.data.map((user, index) => <UserItem
													key={index}
													user={user}
													index={index}
													inProgress={this.state.inProgress}
													handleUpdate={this.handleUpdate.bind(this)}
													handleDelete={this.handleDelete.bind(this)}
													/>)
			: [];

		return <div>
			<PageHead
				title='User Demo'
				description='Demo of add,edit,delete'
			/>

			<h1>User List</h1>

			{userList}
			<div>
				<input placeholder='Enter a email address' value={this.state.email} onChange={this.handleChangeInputText.bind(this)} disabled={this.state.inProgress}/>
				<input placeholder='Enter a password' value={this.state.password} onChange={this.handleChangeInputText.bind(this)} disabled={this.state.inProgress}/>
				<button onClick={this.handleAdd.bind(this)} disabled={this.state.inProgress}>Add User</button>	
				<style jsx>{`
					div {
						margin-top: 1em;
					}
				`}</style>
			</div>

		</div>
	};

}

const createStoreWithThunkMiddleware = applyMiddleware(thunkMiddleware)(createStore);
const makeStore = (reduxState, enhancer) => createStoreWithThunkMiddleware(combineReducers(reduxApi.reducers), reduxState);
const mapStateToProps = (reduxState) => ({ users: reduxState.users }); // Use reduxApi endpoint names here

const IndexPageConnected = withRedux({ createStore: makeStore, mapStateToProps })(IndexPage)
export default IndexPageConnected;
