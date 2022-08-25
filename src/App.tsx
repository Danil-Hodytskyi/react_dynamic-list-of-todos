/* eslint-disable max-len */
import React, {
  useCallback, useEffect, useState, useMemo,
} from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getTodos } from './api';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [inputQuery, setInputQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const filterTodos = useCallback((todoList: Todo[], queryInput: string) => {
    if (!todoList.length) {
      return null;
    }

    return todoList.filter(todo => {
      const includedTitle = todo.title.toLowerCase()
        .includes(queryInput.toLowerCase());

      switch (filter) {
        case 'all':
          return includedTitle;
        case 'active':
          return !todo.completed && includedTitle;
        case 'completed':
          return todo.completed && includedTitle;
        default:
          return todo;
      }
    });
  }, [filter]);

  const filteredTodos = useMemo(() => (
    filterTodos(todos, inputQuery)
  ), [todos, inputQuery, filter]);

  useEffect(() => {
    getTodos().then(todosFromServer => setTodos(todosFromServer));
  });

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                filter={filter}
                inputQuery={inputQuery}
                onFilter={setFilter}
                onInputQuery={setInputQuery}
              />
            </div>

            {todos.length === 0 && <Loader />}
            {filteredTodos && (
              <TodoList
                todos={filteredTodos}
                selectedTodo={selectedTodo}
                onSelectedTodo={setSelectedTodo}
              />
            )}
          </div>
        </div>
      </div>

      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          selectedUser={setSelectedTodo}
        />
      )}
    </>
  );
};
