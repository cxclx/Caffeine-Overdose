import styles from "./Timer.module.scss";

function Timer(props) {
  return (
    <span className={styles.Timer}>
      {props.minutes.toString().padStart(2, "0")}:
      {props.seconds.toString().padStart(2, "0")}
    </span>
  );
}

export default Timer;
