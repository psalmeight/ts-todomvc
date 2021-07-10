import { TodoAndEvents } from "../utils/types";
import { TodoStatus, FilterTypes } from "../utils/constants";

const TodoItem: React.FC<TodoAndEvents> = ({
  onChange,
  onDelete,
  id,
  status,
  text,
}) => {
  return (
    <div key={`cbx-${id}`} className="todo-row">
      <div className="round">
        <input
          type="checkbox"
          id={`checkbox${id}`}
          onChange={onChange ? (e) => onChange(id)(e) : () => {}}
          checked={status === FilterTypes.Completed}
        />
        <label htmlFor={`checkbox${id}`}></label>
      </div>

      <div
        className={
          status === TodoStatus.Pending ? "todo-text" : "todo-text-complete"
        }
        style={{
          textDecoration:
            status === TodoStatus.Completed ? "line-through" : "none",
        }}
      >
        {text}
      </div>
      <button
        className="toggle-remove"
        onClick={onDelete ? () => onDelete(id) : () => {}}
      >
        ×
      </button>
    </div>
  );
};

export default TodoItem;
