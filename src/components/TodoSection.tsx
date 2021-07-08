import { useEffect, useState } from "react";
interface RowData {
  id: number;
  status: string;
  text: string;
}

interface StateProps {
  pendingCount: number | 0;
  filter: string;
  currentText: string;
}

const FilterTypes = { ALL: "all", ACTIVE: "active", COMPLETE: "completed" };
const TodoStatus = { PENDING: "pending", COMPLETE: "completed" };

function TodoSection() {
  const [state, setState] = useState<StateProps>({
    pendingCount: 0,
    filter: FilterTypes.ALL,
    currentText: "",
  });

  const [todoList, setTodoList] = useState<RowData[]>([]);

  useEffect(() => {
    if (localStorage.getItem("todoList") !== null) {
      let todoJson = localStorage.getItem("todoList");
      setTodoList(
        todoJson !== null
          ? JSON.parse(localStorage.getItem("todoList") || "")
          : []
      );

      let stateJson = localStorage.getItem("currentState");

      setState(
        stateJson !== null
          ? JSON.parse(localStorage.getItem("currentState") || "")
          : {}
      );
    }
  }, []);

  useEffect(() => {
    setState({
      ...state,
      pendingCount: todoList.filter(
        (todo) => todo.status === TodoStatus.PENDING
      ).length,
      currentText: "",
    });

    localStorage.setItem("todoList", JSON.stringify(todoList));
  }, [todoList]);

  useEffect(() => {
    localStorage.setItem("currentState", JSON.stringify(state));
  }, [state]);

  const addToTodoList = () => {
    let todoListCopy: RowData[] = [...todoList];

    todoListCopy.push({
      id: todoListCopy.length + 1,
      status: TodoStatus.PENDING,
      text: state.currentText,
    });

    setTodoList(todoListCopy);
  };

  const changeValue = (e: any) => {
    setState({
      ...state,
      currentText: e.target.value,
    });
  };

  const onCheck = (e: any, id: number) => {
    let todoListCopy: RowData[] = [...todoList];

    let tempCopy = todoListCopy.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          status: e.target.checked ? TodoStatus.COMPLETE : TodoStatus.PENDING,
        };
      }
      return todo;
    });

    setTodoList(tempCopy);
  };

  const onDelete = (id: number) => {
    let todoListCopy: RowData[] = [];

    todoList.forEach((todo) => {
      if (todo.id !== id) {
        todoListCopy.push(todo);
      }
    });

    setTodoList(todoListCopy);
  };

  const onEnter = async (e: any) => {
    if (e.key === "Enter" && state.currentText !== "") {
      await addToTodoList();
    }
  };

  const clearCompleted = () => {
    let todoListCopy: RowData[] = [...todoList];

    let tempCopy = todoListCopy.filter(
      (todo) => todo.status === TodoStatus.PENDING
    );

    setTodoList(tempCopy);
  };

  const renderTodo = (todo: RowData, idx: number) => {
    return (
      <div key={`${idx}-cbx-${todo.id}`} className="todo-row">
        <div className="round">
          <input
            type="checkbox"
            id={`checkbox${todo.id}`}
            onChange={(e) => onCheck(e, todo.id)}
            checked={todo.status === FilterTypes.COMPLETE}
          />
          <label htmlFor={`checkbox${todo.id}`}></label>
        </div>

        <div
          className={
            todo.status === TodoStatus.PENDING
              ? "todo-text"
              : "todo-text-complete"
          }
          style={{
            textDecoration:
              todo.status === TodoStatus.COMPLETE ? "line-through" : "none",
          }}
        >
          {todo.text}
        </div>
        <button className="toggle-remove" onClick={() => onDelete(todo.id)}>
          ×
        </button>
      </div>
    );
  };

  const renderFilter = (filterType: string, idx: number) => {
    let className = "todo-filter-btn";

    if (filterType === state.filter) {
      className += " todo-filter-btn-selected";
    }

    return (
      <button
        className={className}
        onClick={() => setState({ ...state, filter: filterType })}
      >
        {filterType}
      </button>
    );
  };

  const applyFilter = (todo: RowData) => {
    switch (state.filter) {
      case FilterTypes.ACTIVE:
        if (todo.status === TodoStatus.PENDING) return todo;
        break;
      case FilterTypes.COMPLETE:
        if (todo.status === TodoStatus.COMPLETE) return todo;
        break;
      case FilterTypes.ALL:
        return todo;
    }
  };

  return (
    <div className="todo-container">
      <div>
        <div className="todo-input">
          <div
            className={
              state.pendingCount == 0
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
            onKeyUp={(e) => onEnter(e)}
            value={state.currentText}
          />
        </div>
      </div>

      {/* List of todo section */}
      {todoList ? todoList.filter(applyFilter).map(renderTodo) : null}

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
            {todoList.filter((todo) => todo.status === TodoStatus.COMPLETE)
              .length > 0 ? (
              <button className="todo-clear-btn" onClick={clearCompleted}>
                Clear Completed
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TodoSection;
