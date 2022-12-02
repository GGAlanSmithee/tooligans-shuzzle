import { useEffect, useState, useRef } from "react";

const Counter = ({ isSolved }) => {
  const [timer, setTimer] = useState();

  const interval = useRef();

  useEffect(() => {
    if (interval.current) clearTimeout(interval.current);
    if (isSolved) return;

    interval.current = setInterval(() => {
      setTimer((oldTimer) => (oldTimer || 0) + 1);
    }, 1000);

    return () => {
      if (interval.current) clearTimeout(interval.current);
    };
  }, [isSolved, timer, setTimer, interval]);

  return <>{timer ? <div>{timer === 1 ? "1 second" : `${timer} seconds`}</div> : <div />}</>;
};

export { Counter };
