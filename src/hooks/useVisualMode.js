import { useState } from "react";

export default function useVisualMode(initial) {

  const[mode, setMode] = useState(initial);
  const[history, setHistory] = useState([initial]);

  const transition = (newMode, replace = false) => {
    if(replace) {
      let newHis = [...history];
      newHis.pop();
      newHis.push(newMode);
      setHistory(newHis);
      setMode(prev => newMode);
    } else {
      setHistory(prev => (prev[prev.length - 1] !== newMode ? [...prev, newMode] : [...prev]));
      setMode(prev => newMode);
    }
  }

  const back = () => {
    let newHis = [...history];
    let last = newHis.pop();
    setHistory(prev => newHis);
    setMode(prev => newHis.length !== 0 ? newHis[newHis.length - 1] : last);
  }

  return {mode, transition, back};
}

/**
 * replace参数的意思，如果是true，把history里的最后一个状态删掉，把自己填上，这样back的时候就能回到第一个状态
 */