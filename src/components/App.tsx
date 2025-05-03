import { KeyboardEvent, useCallback, useMemo, useState } from "react";
import styles from "./App.module.scss";
import TodoItem, { TodoItemType } from "./todoItem/TodoItem";

export interface TodoFilter {
  name: string;
  filter: (todos: TodoItemType[]) => TodoItemType[];
}

const items: TodoItemType[] = [];

const filters: TodoFilter[] = [
  {
    name: "Все",
    filter: (todos) => todos,
  },
  {
    name: "Активные",
    filter: (todos) => todos.filter((todo) => !todo.done),
  },
  {
    name: "Завершенные",
    filter: (todos) => todos.filter((todo) => todo.done),
  },
];

function App() {
  const [todos, setTodos] = useState(items);
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [newTodoText, setNewTodoText] = useState("");

  const todoClickHandler = (todoSwitched: TodoItemType) => {
    setTodos((currTodos) =>
      currTodos.map((todo) =>
        todo.text === todoSwitched.text ? { ...todo, done: !todo.done } : todo
      )
    );
  };

  const todoDeleteHandler = (todoDeleted: TodoItemType) => {
    console.log("govno");
    setTodos((currTodos) =>
      currTodos.filter((todo) => todo.text !== todoDeleted.text)
    );
  };

  console.log(123);

  const todoAddHandler = useCallback(() => {
    if (!newTodoText) {
      return;
    }

    setTodos((currTodos) => [
      ...currTodos,
      {
        text: newTodoText,
        done: false,
      },
    ]);

    setNewTodoText("");
  }, [newTodoText]);

  const filteredTodos = useMemo(
    () => activeFilter.filter(todos),
    [todos, activeFilter]
  );

  return (
    <div className={styles.todolist}>
      <h1>Ну и дела</h1>

      <div className={styles.filters}>
        {filters.map((filter) => (
          <div
            className={`${styles.filter} ${
              filter.name === activeFilter.name ? styles.active : ""
            }`}
            onClick={() => setActiveFilter(filter)}
            key={filter.name}
          >
            {filter.name}
          </div>
        ))}
      </div>

      <div className={styles.listContainer}>
        {filteredTodos.map((todo) => (
          <TodoItem
            text={todo.text}
            done={todo.done}
            todoClickHandler={() => todoClickHandler(todo)}
            todoDeletedHandler={() => todoDeleteHandler(todo)}
            key={todo.text}
          />
        ))}
      </div>

      <div className={styles.addTodo}>
        <textarea
          placeholder="Введите тудушку..."
          value={newTodoText}
          onChange={(e) => {
            if (e.target.value !== "\n") {
              setNewTodoText(e.target.value);
              console.log("3333333333");
            }
          }}
          onKeyDown={(e: KeyboardEvent) => {
            console.log("11111");
            if (e.code === "Enter") {
              todoAddHandler();
            }
          }}
        ></textarea>

        <button onClick={todoAddHandler} className={styles.addButton}>
          Добавить
        </button>
      </div>
    </div>
  );
}

export default App;
