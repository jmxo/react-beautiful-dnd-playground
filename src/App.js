import React, { Component } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';

const Container = styled.div`
  display: flex;
`;

class App extends Component {
  state = initialData;

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const columnStart = this.state.columns[source.droppableId];
    const columnFinish = this.state.columns[destination.droppableId];

    const newColumnStartTaskIds = Array.from(columnStart.taskIds);
    const newColumnFinishTaskIds = Array.from(columnFinish.taskIds);

    // start at source.index and remove 1 item
    newColumnStartTaskIds.splice(source.index, 1);

    // If an item is moved to the same list, remove it from the new list too
    if (source.droppableId === destination.droppableId) {
      newColumnFinishTaskIds.splice(source.index, 1);
    }

    // from the destination.index: remove nothing, then insert draggableId
    newColumnFinishTaskIds.splice(destination.index, 0, draggableId);

    const newStartColumn = {
      ...columnStart,
      taskIds: newColumnStartTaskIds
    };

    const newFinishColumn = {
      ...columnFinish,
      taskIds: newColumnFinishTaskIds
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStartColumn.id]: newStartColumn,
        [newFinishColumn.id]: newFinishColumn
      }
    };

    this.setState(newState);
  };

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Container>
          {this.state.columnOrder.map(columnId => {
            const column = this.state.columns[columnId];
            const tasks = column.taskIds.map(
              taskId => this.state.tasks[taskId]
            );
            return <Column key={column.id} column={column} tasks={tasks} />;
          })}
        </Container>
      </DragDropContext>
    );
  }
}

export default App;
