import React, { useEffect, useState } from "react";

const useDebounce = (inputValue, delay) => {
  const [debounceValue, setDebounceValue] = useState("");
  useEffect(() => {
    const setTimeoutId = setTimeout(() => {
      setDebounceValue(inputValue);
    }, delay);

    return () => {
      clearTimeout(setTimeoutId);
    };
  }, [inputValue, delay]);

  return debounceValue;
};

export default useDebounce;
