import React, { Component } from 'react';
import './Dashboard.scss';
import Sidebar from '../../Sidebar/Sidebar';
import Header from '../../Header/Header';
import Column from '../../Column/Column';
import AddButton from '../../AddButton/AddButton';

import Tooltip from '@material-ui/core/Tooltip';
import { DragDropContext } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';

export default class Dashboard extends Component {
   state = {
      columns: {
         'column-1': {
            id: 'column-1',
            title: 'To Dos',
            taskIds: ['task-1', 'task-2', 'task-3'],
            colorCode: [0, 160, 10, 1],
         },
         'column-2': {
            id: 'column-2',
            title: 'In Progress',
            taskIds: ['task-4', 'task-5', 'task-6'],
            colorCode: [242, 173, 0, 1],
         },
         'column-3': {
            id: 'column-3',
            title: 'Completed',
            taskIds: ['task-7', 'task-8', 'task-9'],
            colorCode: [0, 88, 242, 1],
         },
      },
      tasks: {
         'task-1': { id: 'task-1', title: 'Task 1', content: 'Wash Dishes'},
         'task-2': { id: 'task-2', title: 'Task 2', content: 'Take out trash'},
         'task-3': { id: 'task-3', title: 'Task 3', content: 'Clean Car'},
         'task-4': { id: 'task-4', title: 'Task 4', content: 'Wash Dishes'},
         'task-5': { id: 'task-5', title: 'Task 5', content: 'Take out trash'},
         'task-6': { id: 'task-6', title: 'Task 6', content: 'Clean Car'},
         'task-7': { id: 'task-7', title: 'Task 7', content: 'Wash Dishes'},
         'task-8': { id: 'task-8', title: 'Task 8', content: 'Take out trash'},
         'task-9': { id: 'task-9', title: 'Task 9', content: 'Clean Car'},
      },
      columnOrder: ['column-1', 'column-2', 'column-3'],
      displayAddButton: true,
   };

   onDragStart = () => {
      this.setState({ displayAddButton: false })
   };

   onDragUpdate = update => {

   };

   onDragEnd = result => {
      const { source, destination, draggableId, type } = result;

      if (!destination) {
         return;
      }
      if (
         destination.droppableId === source.droppableId &&
         destination.index === source.index
      ) {
         return;
      }

      // If dragged item is a column
      if (type === 'column') {
         const newColumnOrder = Array.from(this.state.columnOrder);
         newColumnOrder.splice(source.index, 1); // removing column out of original position
         newColumnOrder.splice(destination.index, 0, draggableId); // putting column in new position

         const newState = {
            ...this.state,
            columnOrder: newColumnOrder,
            displayAddButton: true,
         };
         this.setState(newState);
         return;
      }

      const start = this.state.columns[source.droppableId];
      const finish = this.state.columns[destination.droppableId];

      // If task is moved within the same column
      if (start === finish) {
         const newTaskIds = Array.from(start.taskIds);
         newTaskIds.splice(source.index, 1);
         newTaskIds.splice(destination.index, 0, draggableId);
   
         const newColumn = {
            ...start,
            taskIds: newTaskIds
         };
   
         const newState = {
            ...this.state,
            columns: {
               ...this.state.columns,
               [newColumn.id]: newColumn
            },
            displayAddButton: true,
         };
   
         this.setState(newState);
      } else {
         // Moving task from one column to another
         const startTaskIds = Array.from(start.taskIds);
         startTaskIds.splice(source.index, 1);
         const newStart = {
            ...start,
            taskIds: startTaskIds,
         };
   
         const finishTaskIds = Array.from(finish.taskIds);
         finishTaskIds.splice(destination.index, 0, draggableId);
         const newFinish = {
            ...finish,
            taskIds: finishTaskIds
         };
   
         const newState = {
            ...this.state,
            columns: {
               ...this.state.columns,
               [newStart.id]: newStart,
               [newFinish.id]: newFinish
            },
            displayAddButton: true,
         };
   
         this.setState(newState);
      }
   };
   
   displayColumns = () => {
      const { tasks, columns, columnOrder } = this.state;
      let columnArr = columnOrder.map((columnId, index) => {
         const column = columns[columnId];
         const taskArr = column.taskIds.map(taskId => tasks[taskId]);
         return (
            <Column
               key={column.id}
               column={column}
               tasks={taskArr}
               index={index}
               colorCode={column.colorCode}
            />
         );
      })

      return (
         <div className='column-container'>
            { columnArr }
            <div style={{ display: this.state.displayAddButton ? 'block' : 'none' }}>
               <Tooltip title={'Add New List'}>
                  <div className='add-list-button-container' >
                     <AddButton />
                  </div>
               </Tooltip>
            </div>
         </div>
      )
   }
	
	render() {
		return (
			<div className='dashboard'>
				<Sidebar />
            <div className='main-content-container'>
               <Header />
               <DragDropContext onDragStart={this.onDragStart} onDragUpdate={this.onDragUpdate} onDragEnd={this.onDragEnd} >
                  <Droppable droppableId='all-columns' direction='horizontal' type='column' >
                     {(provided) => {
                        return (
                           <div
                              className='main-content'
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                           >
                              { this.displayColumns() }
                              { provided.placeholder }
                           </div>
                        )
                     }}
                  </Droppable>
               </DragDropContext>
            </div>
			</div>
		)
	}
}
