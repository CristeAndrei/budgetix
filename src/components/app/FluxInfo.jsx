import React, { useEffect, useState } from 'react';
import {
	Button,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	SvgIcon,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useHistory } from 'react-router-dom';
import { database, firestore, storage } from '../../firebase';
import { useSelector } from 'react-redux';
import moment from 'moment';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

export default function FluxInfo() {
	const [edit, setEdit] = useState(false);
	const [name, setName] = useState('');
	const [balance, setBalance] = useState(0);
	const [totalBalance, setTotalBalance] = useState(0);
	const [open, setOpen] = useState(false);
	const history = useHistory();
	const { flux, childFluxes } = useSelector(({ fluxes }) => fluxes);

	useEffect(() => {
		if (flux.id === null) {
			const sum = childFluxes.reduce(
				(itemSum, item) => itemSum + item.totalBalance,
				0
			);
			setTotalBalance(sum);
			setName('root');
		} else {
			setName(flux.name);
			setBalance(flux.balance);
			setTotalBalance(flux.totalBalance);
		}
	}, [open, childFluxes, flux]);

	function openDialog() {
		setOpen(true);
	}

	function closeDialog() {
		setOpen(false);
		setName('');
		setBalance(0);
		setTotalBalance(0);
		setEdit(false);
	}

	async function clickEditSave() {
		setEdit(!edit);
		if (edit === true) closeDialog();

		if (flux.id === null) return;
		if (edit === true) {
			await database.fluxes.doc(flux.id).update({
				name: name,
			});

			const fluxRef = await database.fluxes
				.where('path', 'array-contains', { id: flux.id, name: flux.name })
				.get();
			//changed map
			fluxRef.docs.forEach((doc) => {
				const data = doc.data();
				const newPath = data.path.map((ele) => {
					if (ele.id === flux.id) ele = { id: flux.id, name: name };
					return ele;
				});

				database.fluxes.doc(doc.id).update({ path: newPath });
			});
		}
	}

	async function deleteFlux() {
		closeDialog();

		database.fluxes
			.where('path', 'array-contains', {
				id: flux.id,
				name: flux.name,
			})
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					//const data = doc.data();
					deleteDataFlux(doc.id);
				});
			})
			.catch((error) => {
				console.log(error);
			});

		flux.parentId == null
			? history.push('/')
			: history.push(`/${flux.type}/${flux.parentId}`);

		await deleteDataFlux(flux.id);
	}

	async function deleteDataFlux(fluxId) {
		//delete flux
		database.fluxes
			.doc(fluxId)
			.delete()
			.catch((error) => {
				console.log(error);
			});
		//delete line from flux
		const batch = firestore.batch();

		const linesRef = await database.lines.where('fluxId', '==', fluxId).get();

		linesRef.forEach((doc) => {
			const data = doc.data();
			if (data.url) {
				const fileRef = storage.refFromURL(data.url);
				if (fileRef) fileRef.delete();
			}
		});

		linesRef.forEach((doc) => batch.delete(doc.ref));
		await batch.commit();
	}

	return (
		<>
			<Button onClick={openDialog}>
				<SvgIcon component={LibraryBooksIcon} />
			</Button>
			<Dialog open={open} onClose={closeDialog}>
				<DialogTitle>
					<Button onClick={closeDialog} startIcon={<ArrowBackIcon />} />
					Info
				</DialogTitle>
				<DialogContent>
					{flux.id && (
						<Typography noWrap>
							Created at:{moment(flux.createdAt).format('MMM Do YYYY')}
						</Typography>
					)}
					<TextField
						margin='dense'
						id='name'
						label='Name'
						type='text'
						fullWidth
						value={name}
						disabled={flux.id === null ? true : !edit}
						onChange={(e) => setName(e.target.value)}
					/>
					{flux.id && (
						<TextField
							margin='dense'
							id='balance'
							label='Flux Balance'
							type='text'
							fullWidth
							value={balance}
							disabled={true}
						/>
					)}
					<TextField
						margin='dense'
						id='totalBalance'
						label='Total Balance'
						type='text'
						fullWidth
						value={totalBalance}
						disabled={true}
					/>
					<DialogActions>
						<Button disabled={flux.id === null} onClick={clickEditSave}>
							{edit ? 'Save' : 'Edit'}
						</Button>
						<Button disabled={flux.id === null} onClick={deleteFlux}>
							Delete
						</Button>
					</DialogActions>
				</DialogContent>
			</Dialog>
		</>
	);
}
