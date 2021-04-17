import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { database } from '../../firebase';
import MomentUtils from '@date-io/moment';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from 'moment';
import {
	Accordion,
	AccordionActions,
	AccordionDetails,
	AccordionSummary,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Divider,
	Fab,
	IconButton,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	Switch,
	TextField,
	Typography,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import AddAlertIcon from '@material-ui/icons/AddAlert';
import { useNotifications } from '../../hooks/useNotifications';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
import RemoveCircleIcon from '@material-ui/icons/RemoveCircle';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import ErrorIcon from '@material-ui/icons/Error';
import CoSnackbar from '../utils/CoSnackbar';
import CoSpinner from '../utils/CoSpinner';

const useStyles = makeStyles((theme) => ({
	customMarginTop: {
		marginTop: '59px',
	},
	customMarginBottom: {
		marginBottom: '70px',
	},
	absoluteFluxNav: {
		position: 'sticky',
		top: '55px',
		width: '100%',
		zIndex: theme.zIndex.drawer + 1,
	},
	addNotificationButton: {
		position: 'fixed',
		bottom: '10px',
		right: '10px',
	},
}));

export default function InvoiceNotifications() {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState(moment());
	const [daysTimeout, setDaysTimeout] = useState('');
	const [text, setText] = useState('');
	const [subscriber, setSubscriber] = useState('');
	const { userName } = useSelector(({ user }) => user.data);
	const { notificationList } = useNotifications(userName);
	const [userList, setUserList] = useState([userName]);
	const [submit, setSubmit] = useState('');
	const [notificationId, setNotificationId] = useState('');
	const [error, setError] = useState('');
	const [status, setStatus] = useState('');
	const [loading, setLoading] = useState(false);

	function closeDialog() {
		setOpen(false);
	}

	function openAddNotification(notification) {
		setOpen(true);
		setSelectedDate(moment());
		setDaysTimeout('');
		setText('');
		setSubscriber('');
		setUserList([userName]);
		setSubmit('add');
		setNotificationId('');
	}

	function openUpdateNotification(notification) {
		setOpen(true);
		setSelectedDate(notification.performAt);
		setDaysTimeout(notification.options.daysTimeout);
		setText(notification.options.payload.notification.body);
		setSubscriber('');
		setUserList(notification.options.userList);
		setSubmit('update');
		setNotificationId(notification.id);
		setStatus(notification.status);
	}

	async function deleteNotification() {
		closeDialog();
		setLoading(true);

		try {
			const notificationRef = database.tasks.doc(notificationId);
			await notificationRef.delete();
		} catch (error) {
			setError(error);
		}

		setLoading(false);
	}

	async function handleToggleNotification(item) {
		setLoading(true);

		try {
			const newStatus =
				item.status !== 'error' &&
				(item.status === 'scheduled' ? 'disabled' : 'scheduled');

			const notificationRef = database.tasks.doc(item.id);
			await notificationRef.update({ status: newStatus });
		} catch (error) {
			setError(error);
		}

		setLoading(false);
	}

	function removeSubscribedUser(username) {
		setUserList((prevState) => prevState.filter((item) => item !== username));
	}

	async function subscribeUser() {
		if (subscriber === '') {
			setError('Enter username name');
			return;
		}

		const existInList = userList.filter((item) => item === subscriber);

		if (existInList.length) {
			setError('User already added');
			return;
		}

		setLoading(true);

		try {
			const checkUsername = await database.users
				.where('userName', '==', subscriber)
				.get();
			if (checkUsername.empty) {
				setError("Username doesn't exist");
				setLoading(false);
				return;
			}
			setUserList((prevUserList) => [...prevUserList, subscriber]);
			setSubscriber('');
		} catch (error) {
			setError(error);
		}

		setLoading(false);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		closeDialog();
		setLoading(true);
		let daysTimeoutInt = parseInt(daysTimeout);

		switch (submit) {
			case 'add':
				try {
					await database.tasks.add({
						performAt: database.getTimestampFromMillis(selectedDate.valueOf()),
						type: 'invoiceNotification',
						status: 'scheduled',
						worker:
							userList.length > 1
								? 'sendMultipleDeviceMessage'
								: 'sendDeviceMessage',
						options: {
							userList: userList,
							daysTimeout: daysTimeoutInt,
							payload: {
								notification: {
									title: 'Invoice notification',
									body: text,
								},
							},
						},
					});
				} catch (error) {
					setError(error);
				}
				break;
			case 'update':
				try {
					const notificationRef = database.tasks.doc(notificationId);
					await notificationRef.update({
						performAt: database.getTimestampFromMillis(selectedDate.valueOf()),
						type: 'invoiceNotification',
						status: status,
						worker:
							userList.length > 1
								? 'sendMultipleDeviceMessage'
								: 'sendDeviceMessage',
						options: {
							userList: userList,
							daysTimeout: daysTimeoutInt,
							payload: {
								notification: {
									title: 'Invoice notification',
									body: text,
								},
							},
						},
					});
				} catch (error) {
					setError(error);
				}

				break;

			default:
		}

		setLoading(false);
	}

	return Notification.permission === 'granted' ? (
		<>
			<div className={classes.customMarginTop}>
				<Typography>Notifications</Typography>
				<Divider />
				<List>
					{notificationList.map((item) => (
						<ListItem key={item.id}>
							<ListItemIcon>
								<IconButton
									aria-label='edit'
									onClick={() => openUpdateNotification(item)}>
									<NotificationsActiveIcon />
								</IconButton>
							</ListItemIcon>
							<ListItemText>
								{item.options.payload.notification.title}
							</ListItemText>
							<ListItemSecondaryAction>
								{item.status === 'error' ? (
									<ErrorIcon />
								) : (
									<Switch
										edge='end'
										onChange={() => handleToggleNotification(item)}
										checked={item.status === 'scheduled'}
										inputProps={{
											'aria-labelledby': 'switch-list-label-bluetooth',
										}}
									/>
								)}
							</ListItemSecondaryAction>
						</ListItem>
					))}
				</List>
			</div>
			<Dialog
				open={open}
				onClose={closeDialog}
				aria-labelledby='form-dialog-title'>
				<DialogTitle id='form-dialog-title'>
					<Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
					Notification
				</DialogTitle>
				<form onSubmit={handleSubmit}>
					<DialogContent>
						<MuiPickersUtilsProvider utils={MomentUtils}>
							<KeyboardDatePicker
								disableToolbar
								variant='inline'
								format='MM/dd/yyyy'
								margin='normal'
								id='date-picker-inline'
								label='Date picker inline'
								value={selectedDate}
								onChange={(date) => setSelectedDate(date)}
								KeyboardButtonProps={{
									'aria-label': 'change date',
								}}
							/>
						</MuiPickersUtilsProvider>
						<TextField
							required
							margin='dense'
							id='text'
							label='Notification Text'
							type='text'
							fullWidth
							value={text}
							onChange={(e) => setText(e.target.value)}
						/>
						<TextField
							required
							margin='dense'
							id='value'
							label='Interval in days'
							type='number'
							fullWidth
							value={daysTimeout}
							onChange={(e) => setDaysTimeout(e.target.value)}
						/>
						<Accordion style={{ marginTop: '15px' }}>
							<AccordionSummary>
								Subscribe users to this notification
							</AccordionSummary>
							<AccordionDetails>
								<List>
									{userList.map(
										(item) =>
											item !== userName && (
												<ListItem key={item.id}>
													<ListItemIcon>
														<PersonOutlineIcon />
													</ListItemIcon>
													<ListItemText>
														<Typography
															noWrap={true}
															style={{ maxWidth: '115px' }}>
															{item}
														</Typography>
													</ListItemText>
													<ListItemSecondaryAction>
														<IconButton
															edge='end'
															aria-label='delete'
															onClick={() => removeSubscribedUser(item)}>
															<RemoveCircleIcon />
														</IconButton>
													</ListItemSecondaryAction>
												</ListItem>
											)
									)}
								</List>
							</AccordionDetails>
							<AccordionActions>
								<TextField
									style={{ marginBottom: '27px' }}
									margin='dense'
									id='username'
									label='Username'
									type='text'
									fullWidth
									value={subscriber}
									onChange={(e) => setSubscriber(e.target.value)}
								/>
								<IconButton aria-label='add' onClick={subscribeUser}>
									<AddIcon />
								</IconButton>
							</AccordionActions>
						</Accordion>
					</DialogContent>
					<DialogActions>
						{submit === 'update' && (
							<Button onClick={() => deleteNotification()} color='primary'>
								Delete
							</Button>
						)}
						<Button type='submit' color='primary'>
							{submit === 'update' ? 'Update' : 'Submit'}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
			<Fab
				className={classes.addNotificationButton}
				onClick={openAddNotification}>
				<AddAlertIcon />
			</Fab>
			{error !== '' && (
				<CoSnackbar
					text={error}
					type='error'
					vertical='top'
					horizontal='center'
					onCloseCo={() => setError('')}
				/>
			)}
			<CoSpinner open={loading} />
		</>
	) : (
		<></>
	);
}
