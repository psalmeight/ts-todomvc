import {
  useEffect,
  useState,
  ChangeEventHandler,
  KeyboardEventHandler,
  ChangeEvent,
} from "react";

import TodoItem from "./components/TodoItem";

import { FilterTypes, TodoStatus } from "./utils/constants";
import { Todo, TodoAndEvents, StateProps } from "./utils/types";

function App() {
  const [todoList, setTodoList] = useState<Todo[]>([]);

  const [state, setState] = useState<StateProps>({
    pendingCount: 0,
    filterType: FilterTypes.All,
    currentText: "",
  });

  const recalculateState = () => {
    setState((s) => {
      s.pendingCount = todoList.filter(
        (todo) => todo.status === TodoStatus.Pending
      ).length;

      s.currentText = "";

      return s;
    });
  };

  useEffect(() => {
    recalculateState();
    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  useEffect(() => {
    localStorage.setItem("currentState", JSON.stringify(state));
  }, [state]);

  const addToTodoList = () => {
    let currentList: Todo[] = [...todoList];

    setTodoList([
      ...currentList,
      {
        id: currentList.length + 1,
        status: TodoStatus.Pending,
        text: state.currentText,
      },
    ]);
  };

  const changeValue: ChangeEventHandler<HTMLInputElement> = (e) => {
    setState({
      ...state,
      currentText: e.target.value,
    });
  };

  const onCheck = (id: number) => (e: ChangeEvent<HTMLInputElement>) => {
    setTodoList(
      todoList.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            status: e.target.checked
              ? TodoStatus.Completed
              : TodoStatus.Pending,
          };
        }
        return todo;
      })
    );
  };

  const onDelete = (id: number) => {
    let currentList: Todo[] = [...todoList];

    let objIdx = currentList.map((x) => x.id).indexOf(id);
    currentList.splice(objIdx, 1);

    setTodoList(currentList);
  };

  const onEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && state.currentText !== "") {
      addToTodoList();
    }
  };

  const clearCompleted = () => {
    setTodoList(todoList.filter((todo) => todo.status === TodoStatus.Pending));
  };

  const renderFilter = (filterType: string, idx: number) => {
    let className = "todo-filter-btn";

    if (filterType === state.filterType) {
      className += " todo-filter-btn-selected";
    }

    return (
      <button
        className={className}
        onClick={() => setState({ ...state, filterType: filterType })}
      >
        {filterType}
      </button>
    );
  };

  const applyFilter = (todo: Todo) => {
    switch (state.filterType) {
      case FilterTypes.Active:
        if (todo.status === TodoStatus.Pending) return todo;
        break;
      case FilterTypes.Completed:
        if (todo.status === TodoStatus.Completed) return todo;
        break;
      case FilterTypes.All:
        return todo;
    }
  };

  return (
    <div className="main-container">
      <h1 className="todo-title">todos</h1>

      <div className="todo-container">
        <div>
          <div className="todo-input">
            <div
              className={
                state.pendingCount === 0
                  ? "toggle-icon toggle-icon-active"
                  : "toggle-icon"
              }
            >
              {todoList.length > 0 ? "❯" : null}
            </div>

            <input
              name={"todo-input"}
              placeholder="What needs to be done?"
              onChange={changeValue}
              onKeyUp={onEnter}
              value={state.currentText}
            />
          </div>
        </div>

        {/* List of todo section */}
        {todoList
          ? todoList
              .filter(applyFilter)
              .map((todo: TodoAndEvents) => (
                <TodoItem
                  key={`todo-item-${todo.id}`}
                  {...todo}
                  onChange={onCheck}
                  onDelete={onDelete}
                />
              ))
          : null}

        {todoList.length > 0 ? (
          <div className="todo-footer">
            {/* List of todo filters */}
            <div className="todo-footer-left">
              <label>{state?.pendingCount} item left</label>
            </div>
            <div className="todo-footer-center">
              {["all", "active", "completed"].map(renderFilter)}
            </div>
            {/* Clear completed button */}
            <div className="todo-footer-right">
              {todoList.filter((todo) => todo.status === TodoStatus.Completed)
                .length > 0 ? (
                <button className="todo-clear-btn" onClick={clearCompleted}>
                  Clear Completed
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
