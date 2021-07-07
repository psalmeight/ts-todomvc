import { useEffect, useState } from "react";
interface RowData {
  id: number;
  status: string;
  text: string;
  show: boolean | true;
}

interface StateProps {
  pendingCount: number | 0;
  filter: string;
  currentText: string;
}

const FilterTypes = { ALL: "all", ACTIVE: "active", COMPLETE: "complete" };
const TodoStatus = { PENDING: "pending", COMPLETE: "complete" };

function TodoSection() {
  const [state, setState] = useState<StateProps>({
    pendingCount: 0,
    filter: FilterTypes.ALL,
    currentText: "",
  });

  const [todoList, setTodoList] = useState<RowData[]>([]);

  useEffect(() => {
    setState({
      ...state,
      pendingCount: todoList.filter(
        (todo) => todo.status === TodoStatus.PENDING
      ).length,
      currentText: "",
    });
  }, [todoList]);

  const addToTodoList = () => {
    let todoListCopy: RowData[] = [...todoList];

    todoListCopy.push({
      id: todoListCopy.length + 1,
      status: TodoStatus.PENDING,
      text: state.currentText,
      show: true,
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
      <div key={`${idx}-cbx`} className="todo-row">
        <div className="round">
          <input
            type="checkbox"
            id="checkbox"
            onChange={(e) => onCheck(e, todo.id)}
          />
          <label htmlFor="checkbox"></label>
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
      <input
        name={"todo-input"}
        className="todo-input"
        placeholder="What needs to be done?"
        onChange={changeValue}
        onKeyUp={(e) => onEnter(e)}
        value={state.currentText}
      />

      {/* List of todo section */}
      {todoList ? todoList.filter(applyFilter).map(renderTodo) : null}

      <div className="todo-footer">
        {/* List of todo filters */}
        <div className="todo-footer-left">
          <label>{state?.pendingCount} item left</label>
        </div>
        <div className="todo-footer-center">
          {["all", "active", "complete"].map(renderFilter)}
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
    </div>
  );
}

export default TodoSection;
