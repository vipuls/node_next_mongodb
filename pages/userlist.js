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
		// Get all users
		const users = await store.dispatch(reduxApi.actions.users.sync());
		return { users };
	}

	constructor (props) {
		super(props)
		this.state = { email: '' , password : '' }
	}

	handleChangeInputText (event) {
		this.setState({ email: event.target.value });
	}


	render () {

		const {users} = this.props;//dd

		const userList = users.data
			? users.data.map((email, index) => <UserItem
													key={index}
													email={email}
													index={index}
													inProgress={this.state.inProgress}
										
													/>)
			: [];

		return <div>
			<PageHead
				title='User List'
				description='User List'
			/>

			<h1>Users</h1>

			{userList}
			<div>
				
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
const mapStateToProps = (reduxState) => ({ kittens: reduxState.kittens }); // Use reduxApi endpoint names here

const IndexPageConnected = withRedux({ createStore: makeStore, mapStateToProps })(IndexPage)
export default IndexPageConnected;
