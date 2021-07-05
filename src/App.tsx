import React from "react";
import logo from "./logo.svg";
import TodoSection from "./components/TodoSection";

function App() {
  return (
    <div className="main-container">
      <h1 className="todo-title">todos</h1>
      <TodoSection />
    </div>
  );
}

export default App;
