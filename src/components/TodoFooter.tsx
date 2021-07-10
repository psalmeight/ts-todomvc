import { StateProps } from "../utils/types";

const TodoFooter: React.FC<StateProps> = ({ pendingCount }) => {
  return (
    <div className="todo-footer">
      <div className="todo-footer-left">
        <label>{pendingCount} item left</label>
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
  );
};
