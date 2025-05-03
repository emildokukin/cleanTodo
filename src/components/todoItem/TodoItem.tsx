import styles from "./TodoItem.module.scss";

export interface TodoItemType {
  text: string;
  done: boolean;
}

export interface TodoItemProps extends TodoItemType {
  todoClickHandler: () => void;
  todoDeletedHandler: () => void;
}

function TodoItem({
  text,
  done,
  todoClickHandler,
  todoDeletedHandler,
}: TodoItemProps) {
  console.log(text,
    done,
    todoClickHandler,
    todoDeletedHandler,);
  
  return (
    <div className={`${styles.container} ${done ? styles.isChecked : ""}`}>
      <div className={styles.leftPart} onClick={todoClickHandler}>
        <input type="checkbox" checked={done} readOnly />
        <span className={styles.checkboxIndicator}></span>
        <span className={styles.text}>{text}</span>
      </div>

      <div className={styles.rightPart}>
        <button onClick={todoDeletedHandler} className={styles.removeButton}>
          &times;
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
