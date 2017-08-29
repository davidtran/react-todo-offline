import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addTodo, removeTodo, clearTodo } from './redux/todo';
import './App.css';

class App extends Component {

  state = {
    todoContent: ''
  }

  render() {
    let {todoContent} = this.state;
    let {todos, clearTodo} = this.props;
    return (
      <div className="todo-wrapper">

        <div className="todo-form">
          <input type="text" ref={todoInput => this.todoInput = todoInput} onKeyDown={e => this.addTodo(e)} />
        </div>

        <div className="todo-list">

          { todos.map(todo =>
            <div className="todo-item" key={todo.id}>
              <div className="todo-content">
              {todo.content}
              </div>
              <div className="todo-remove-button" onClick={() => this.removeTodo(todo)}>
                &times;
              </div>
            </div>
          )}
        </div>

        { todos && todos.length > 0 &&
          <button onClick={clearTodo} className="clear-todo">Clear All</button>
        }




      </div>
    );
  }

  addTodo = (e) => {
    if (e.keyCode === 13) {
      if (!this.todoInput.value) return;
      this.props.addTodo(this.todoInput.value);
      this.todoInput.value = '';
    }

  }

  removeTodo = (todo) => {
    this.props.removeTodo(todo.tempTodoId, todo.id);
  }
}

const mapStateToProps = state => ({
  todos: state.todos.filter(item => !item.isDeleting)
});

const mapDispatchToProps = dispatch => ({
  addTodo: content => dispatch(addTodo(content)),
  removeTodo: (tempTodoId, todoId) => dispatch(removeTodo(tempTodoId, todoId)),
  clearTodo: () => dispatch(clearTodo())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
