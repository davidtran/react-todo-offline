export const addTodo = content => {
  return (dispatch, getState) => {
    let todoId = getState().todos.length + 1;
    dispatch(addTodoWithId(content, todoId));
  }
}
export const addTodoWithId = (content, tempId) => ({
  type: 'ADD_TODO',
  payload: {
    content,
    tempId
  },
  meta: {
    offline: {
      effect: { url: 'http://localhost:3002', method: 'POST', body: { content } },
      commit: { type: 'ADD_TODO_COMMIT', meta: {content, tempId}},
      rollback: { type: 'ADD_TODO_ROLLBACK', meta: {content, tempId}}
    }
  }
});

export const removeTodoAjax = todoId => ({
  type: 'REMOVE_TODO',
  payload: {todoId},
  meta: {
    offline: {
      effect: { url: 'http://localhost:3002/' + todoId, method: 'DELETE' },
      commit: { type: 'REMOVE_TODO_COMMIT', meta: {todoId} },
      rollback: { type: 'REMOVE_TODO_ROLLBACK', meta: {todoId} }
    }
  }
});

export const removeTodo = (tempTodoId, todoId) => {
  return (dispatch, getState) => {
    if (tempTodoId) {
      dispatch({
        type: 'REMOVE_TEMP_TODO',
        tempTodoId
      });
    } else {
      dispatch(removeTodoAjax(todoId));
    }
  }
}

export const clearTodo = () => ({
  type: 'CLEAR_TODO'
});

export const sync = () => {
  return
}

export default function todo(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: action.payload.tempId,
          content: action.payload.content,
          isTemp: true
        }
      ];

    case 'ADD_TODO_COMMIT':
      return state.map(item => {
        if (item.id === action.meta.tempId) {
          return {
            ...item,
            id: action.payload.id,
            isTemp: false
          }
        }
        return item;
      });

    case 'ADD_TODO_ROLLBACK':
      return state.filter(item => item.id === action.payload.tempId);

    case 'REMOVE_TODO':
      return state.map(item => {
        if (item.id === action.payload.todoId) {
          return {
            ...item,
            isDeleting: true
          }
        } else {
          return item;
        }
      });

    case 'REMOVE_TODO_COMMIT':
      return state.filter(item => item.id !== action.meta.todoId);

    case 'REMOVE_TODO_ROLLBACK':
      return state.map(item => {
        if (item.id === action.meta.todoId) {
          delete item.isDeleting;
        }
        return item;
      });

    case 'REMOVE_TEMP_TODO':
      return state.filter(item => item.tempTodoId === action.tempTodoId);

    case 'CLEAR_TODO':
      return [];

    default:
      return state;
  }
}