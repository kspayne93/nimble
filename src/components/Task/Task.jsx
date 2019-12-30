import React, { Component } from 'react';
import './Task.scss';

import axios from 'axios';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import { Draggable } from 'react-beautiful-dnd';


export default class Task extends Component {
	state = {
		content: '',
		displayEditModal: false,
		newTitle: '',
		title: '',
	};

	componentDidMount = () => {
		const { title, content, status } = this.props;
		this.setState({
			title: title,
			newTitle: title,
			content: content,
			status: status,
		});
	};

	handleInput = (key, value) => {
      this.setState({ [key]: value });
	};

	updateTask = async () => {
		const { newTitle, status } = this.state;
		const { id, list_id, created_at, created_by } = this.props;
		const body = {
			title: newTitle,
			status: status,
			list_id: list_id,
			created_at: created_at,
			created_by: created_by,
		};
		try {
			let res = await axios.put(`/task/${parseInt(id)}`, body);
			await this.props.getAllTasks();
			this.props.getLists();
			this.setState({
				displayEditModal: false,
				title: res.data.title,
				newTitle: res.data.title,
			});
		} catch (err) {
			console.log(err);
		}
	};
	
	cancelUpdateTask = () => {
		const { title, content } = this.props;
		this.setState({
			newTitle: title,
			content: content,
			displayEditModal: false,
		});
	};

	deleteTask = async () => {
		const { id } = this.props;
		try {
			await this.props.deleteTask(id);
		} catch (err) {
			console.log(err);
		}
	};

	editModal = () => {
		const { colorCode, formatColor, checkIsLight } = this.props;
		const { title } = this.state;
		const currentColor = formatColor(colorCode);
		const headerTextColor = checkIsLight(colorCode) === true ? 'black' : 'white';

		return (
			<div className='modal-wrapper' onClick={this.cancelUpdateTask}>
				<div className='edit-task-modal' onClick={e => e.stopPropagation()}>
					<div className='edit-task-modal-header' style={{ backgroundColor: currentColor, color: headerTextColor }}>
						<h4>{title}</h4>
					</div>
					<div className='edit-task-modal-body'>
						<div className='edit-task-modal-body-item'>
							<h4>Title</h4>
							<TextField
								required
								id="standard-required"
								value={title}
								onChange={e => this.handleInput('newTitle', e.target.value)}
							/>
						</div>
						<div className='edit-modal-buttons'>
							<div className='edit-modal-delete-container'>
								<Tooltip title={'Delete List'}>
									<IconButton aria-label="delete" onClick={this.deleteTask}>
										<DeleteIcon />
									</IconButton>
								</Tooltip>
							</div>
							<div className='edit-save-cancel-container'>
								<div>
									<Button variant="outlined" color='secondary' onClick={this.cancelUpdateTask}>Cancel</Button>
								</div>
								<div>
									<Button variant="outlined" color='primary' onClick={this.updateTask}>Save</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	};
	
	render() {
		const { title, content } = this.state;
		const { id, index, colorCode, highlightTasksOfUser, assignedUsers } = this.props;

		let highlight = false;
		if (highlightTasksOfUser === 'all') {
			highlight = true;
		} else if (assignedUsers.includes(highlightTasksOfUser)) {
			highlight = true;
		} else if (assignedUsers.length === 0 && highlightTasksOfUser === 'none') {
			highlight = true;
		}

		return (
			<>
				<Draggable draggableId={id} index={index}>
					{(provided, snapshot) => {
						const borderColor = `rgba(${[...colorCode]})`
						const mainStyle = {
							border: snapshot.isDragging ? `2px solid ${borderColor}` : `1px solid ${borderColor}`,
							boxShadow: snapshot.isDragging ? '0px 0px 10px 0px rgba(107,107,107,1)' : 'none',
						};

						const borderStyle = {
							border: highlight ? `2px solid ${borderColor}` : 'none',
							...provided.draggableProps.style
						}

						return (
							<div
								className={highlight ? 'task' : ' task unselected-task'}
								{...provided.draggableProps}
								{...provided.dragHandleProps}
								style={{...mainStyle, ...borderStyle}}
								ref={provided.innerRef} 
							>
								<div className='task-header'>
									<p>{title}</p>
									<Tooltip title={'Edit Task'}>
										<i className={highlight ? 'fas fa-pencil-alt cursor-pointer' : 'fas fa-pencil-alt cursor-pointer unselected-task'} onClick={() => this.setState({ displayEditModal: true })}></i>
									</Tooltip>
								</div>
								<p>{content}</p>
							</div>
						)
					}}
				</Draggable>
				{
					this.state.displayEditModal
					&&
					this.editModal()
				}
			</>
		)
	}
}
