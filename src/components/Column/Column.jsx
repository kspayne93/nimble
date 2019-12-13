import React, { Component } from 'react';
import './Column.scss';
import Task from '../Task/Task';
import ColorPicker from '../ColorPicker/ColorPicker';

import Tooltip from '@material-ui/core/Tooltip';
import { Draggable, Droppable } from 'react-beautiful-dnd';

let lightColors = [
	[255, 205, 210, 1],
	[248, 187, 208, 1],
	[225, 190, 231, 1],
	[209, 196, 233, 1],
	[197, 202, 233, 1],
	[187, 222, 251, 1],
	[179, 229, 252, 1],
	[178, 235, 242, 1],
	[178, 223, 219, 1],
	[200, 230, 201, 1],
	[220, 237, 200, 1],
	[240, 244, 195, 1],
	[255, 249, 196, 1],
	[255, 236, 179, 1],
	[255, 224, 178, 1],
	[255, 204, 188, 1],
	[215, 204, 200, 1],
	[207, 216, 220, 1],
	[255, 255, 255, 1],
	[217, 217, 217, 1]
];

export default class Column extends Component {
	state = {
		title: '',
		columnColorCode: [],
		selectedColorCode: [],
		displayEditModal: false,
		displayColorPicker: false,
	};

	componentDidMount = () => {
		const { column } = this.props;
		this.setState({ 
			title: column.title,
			columnColorCode: column.colorCode,
			selectedColorCode: column.colorCode,
		});
	};

	displayTasks = () => {
		const { tasks } = this.props;
		const { columnColorCode } = this.state;
		return tasks.map((task, index) => {
			return (
				<Task
					key={task.id}
					id={task.id}
					index={index}
					title={task.title}
					content={task.content}
					colorCode={columnColorCode}
				/>
			)
		});
	};

	formatColor = (arr) => `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${arr[3]})`;

	handleColorChange = (event) => {
		const { r, g, b, a } = event.rgb;
		let codeArr = [r, g, b, a];
		console.log(codeArr)
		this.setState({ selectedColorCode: codeArr });
	};

	checkIsLight = (currentColor) => {
		let isLight = false;
		lightColors.forEach(colorArr => {
			if (colorArr.toString() === currentColor.toString()) {
				isLight = true;
			}
		});
		return isLight;
	};
	
	closeColorPicker = () => {
		this.setState({ 
			displayColorPicker: false,
		});
	};

	cancelChanges = () => {
		const { column } = this.props;
		this.setState({ 
			title: column.title,
			columnColorCode: column.colorCode,
			selectedColorCode: column.colorCode,
			displayEditModal: false,
			displayColorPicker: false,
		});
	};

	saveChanges = () => {
		this.setState({
			columnColorCode: this.state.selectedColorCode,
			displayEditModal: false,
			displayColorPicker: false,
		});
	};

	displayEditModal = () => {
		const { column } = this.props;
		const { selectedColorCode } = this.state;
		const currentColor = this.formatColor(selectedColorCode);
		return (
			<div className='modal-wrapper' onClick={this.cancelChanges}>
				<div className='edit-column-modal' onClick={e => e.stopPropagation()}>
					<h2>{column.title}</h2>
					<h4>Edit Column Color:</h4>
					<div onClick={() => this.setState({ displayColorPicker: true })} className='current-color-box' style={{ backgroundColor: currentColor }}></div>
					{
						this.state.displayColorPicker
						&&
						<ColorPicker
							formatColor={this.formatColor}
							handleColorChange={this.handleColorChange}
							closeColorPicker={this.closeColorPicker}
						/>
					}
					<div>
						<button onClick={this.cancelChanges}>Cancel</button>
						<button onClick={this.saveChanges}>Save</button>
					</div>
				</div>
			</div>
		)
	};


	render() {
		const { column, index } = this.props;

		return (
			<Draggable draggableId={column.id} index={index}>
				{(provided, snapshot) => {
					const headerBackgroundColor = this.formatColor(this.state.columnColorCode);
					const headerTextColor = this.checkIsLight(this.state.columnColorCode) === true ? 'black' : 'white';
					const dragColor = `rgba(${this.state.columnColorCode[0]}, ${this.state.columnColorCode[1]}, ${this.state.columnColorCode[2]}, .25)`;
					const columnStyle = {
						boxShadow: snapshot.isDragging ? '0px 0px 10px 1px rgba(107,107,107,1)' : '',
						...provided.draggableProps.style
					}

					return (
						<div
							className='column'
							ref={provided.innerRef}
							{...provided.draggableProps}
							style={columnStyle}
							>
							<div className='column-header' style={{ backgroundColor: headerBackgroundColor, color: headerTextColor }} {...provided.dragHandleProps}>
								<p>{this.state.title}</p>
								<Tooltip title='Edit List'>
									<i onClick={() => this.setState({ displayEditModal: true })} className="fas fa-ellipsis-v cursor-pointer"></i>
								</Tooltip>
							</div>
							{
								this.state.displayEditModal
								&&
								this.displayEditModal()
							}
							<Droppable droppableId={column.id} type='task'>
								{(provided, snapshot) => {
									const style = {
										backgroundColor: snapshot.isDraggingOver ? dragColor : 'rgb(235, 236, 240)',
										...provided.droppableProps.style
									};

									return (
										<div
											className='column-content'
											ref={provided.innerRef}
											style={style}
											{...provided.droppableProps}
										>
											{ this.displayTasks() }
											{ provided.placeholder }
										</div>
									)
								}}
							</Droppable>
							<div className='column-footer'>
								<div className='column-add-button-container cursor-pointer'>
									<i className="fas fa-plus"></i>
									<p>ADD NEW TASK</p>
								</div>
								<Tooltip title={'Delete List'}>
									<div className='column-delete-button cursor-pointer'>
										<i className="far fa-trash-alt"></i>
									</div>
								</Tooltip>
							</div>
						</div>
					)
				}}
			</Draggable>
		)
	}
}
