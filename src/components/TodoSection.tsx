import { KeyboardEventHandler, useEffect } from "react";
import { useState } from "react";
import logo from "./logo.svg";

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

  const [todoList, setTodoList] = useState<RowData[]>([
    { id: 1, status: "pending", text: "Testing testing", show: true },
    { id: 2, status: "pending", text: "Testing Second", show: true },
    { id: 3, status: "pending", text: "Testing Third", show: true },
    { id: 4, status: "pending", text: "Testing Fourth", show: true },
  ]);

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
        <input
          type="checkbox"
          onChange={(e) => onCheck(e, todo.id)}
          checked={todo.status === FilterTypes.COMPLETE}
        />
        <div
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
    return (
      <button onClick={() => setState({ ...state, filter: filterType })}>
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
        break;
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

      {todoList ? todoList.filter(applyFilter).map(renderTodo) : null}

      <div className="todo-footer">
        <span>{state?.pendingCount} item left</span>
        {["all", "active", "complete"].map(renderFilter)}

        <button onClick={clearCompleted}>Clear Completed</button>
      </div>
    </div>
  );
}

export default TodoSection;
