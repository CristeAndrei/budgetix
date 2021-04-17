import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { DefaultThemeProvider } from '../theme/theme';
import Profile from './authentication/Profile';
import Login from './authentication/Login';
import PrivateRoute from './authentication/PrivateRoute';
import ForgotPassword from './authentication/ForgotPassword';
import Signup from './authentication/Signup';
import Dashboard from './app/Dashboard';
import Navbar from './app/Navbar';
import { auth, messaging } from '../firebase';
import { setDeviceFCMToken, setUser } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import CoSpinner from './utils/CoSpinner';
import InvoiceNotifications from './app/InvoiceNotifications';
import getMessagingToken from './helpers/getMessagingToken';
import { getNotificationPermission } from './helpers/getNotificationPermission';
import Budget from './app/budget/Budget';
import { useBudget } from '../hooks/useBudget';

function App() {
	const dispatch = useDispatch();
	const { isAuthenticated, isLoggingIn, isSigningUp } = useSelector(
		({ user }) => user
	);
	const [canLogin, setCanLogin] = useState(false);

	//Setup listeners
	useBudget();

	useEffect(() => {
		getNotificationPermission();
		if (Notification.permission === 'granted') {
			return messaging.onMessage((payload) => {
				console.log('Message received. ', payload);
				let notification = new Notification(payload.notification.title, {
					body: payload.notification.body,
				});
				notification.onclick = function (event) {
					event.preventDefault();
				};
			});
		}
	}, []);

	useEffect(() => {
		if (!isLoggingIn && !isSigningUp) {
			const unAuthStateChange = auth.onAuthStateChanged((user) => {
				if (user) {
					dispatch(
						setUser({
							uid: user.uid,
							email: user.email,
							userName: user.displayName,
							accountType: user.providerData[0].providerId,
						})
					);
					if (Notification.permission === 'granted') {
						const getToken = async () => {
							const token = await getMessagingToken(user.uid);
							dispatch(setDeviceFCMToken({ token }));
						};

						getToken();
					}
				} else {
					setCanLogin(true);
				}
			});

			return () => {
				unAuthStateChange();
				//dispatch(setDeviceFCMToken({ token: null }));
			};
		}
	}, [dispatch, isLoggingIn, isSigningUp]);

	return (
		<>
			{isAuthenticated || canLogin ? (
				<Router>
					<DefaultThemeProvider>
						<Navbar />
						<Switch>
							{/* MoneyRoller */}
							<PrivateRoute exact path='/' component={Dashboard} type='flux' />
							<PrivateRoute
								exact
								path='/flux/:fluxId'
								component={Dashboard}
								type='flux'
							/>
							<PrivateRoute
								exact
								path='/group'
								component={Dashboard}
								type='group'
							/>
							<PrivateRoute
								exact
								path='/group/:fluxId'
								component={Dashboard}
								type='group'
							/>

							{/* Profile */}
							<PrivateRoute path='/user' component={Profile} />

							{/* Notifications */}
							<PrivateRoute
								path='/notifications'
								component={InvoiceNotifications}
							/>

							{/* Budget */}
							<PrivateRoute path='/budget' component={Budget} />

							{/* Auth */}
							<Route path='/signup' component={Signup} />
							<Route path='/login' component={Login} />
							<Route path='/forgot-password' component={ForgotPassword} />
						</Switch>
					</DefaultThemeProvider>
				</Router>
			) : (
				<>
					<CoSpinner open={true} />
				</>
			)}
		</>
	);
}

export default App;
