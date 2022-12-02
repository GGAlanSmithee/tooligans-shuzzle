import { useEffect, useRef } from "react";
import styles from "../styles/Home.module.css";

const Countdown = ({ count, setCount }) => {
  const interval = useRef();

  useEffect(() => {
    if (interval.current) clearTimeout(interval.current);
    if (count < 0) return;

    interval.current = setInterval(() => {
      setCount((oldCount) => oldCount - 1);
    }, 1000);

    return () => {
      if (interval.current) clearTimeout(interval.current);
    };
  }, [count, setCount, interval]);

  if (count < 0) return null

  if (count === 0) return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div style={{
          fontFamily: "sans-serif",
          fontSize: "5rem",
          textTransform: "uppercase"
        }}>Shuzzle !</div>
      </main>
    </div>
  )

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div style={{
          fontFamily: "sans-serif",
          fontSize: "5rem"
        }}>{count}</div>
      </main>
    </div>
  );
};

export { Countdown };
