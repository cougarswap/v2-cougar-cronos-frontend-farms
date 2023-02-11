import React, { useState } from "react";

const getQuery = () => {
  if (typeof window !== "undefined") {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
};

const getQueryStringVal = (key: string): string | null => {
  return getQuery().get(key);
};

const useQueryParam = (
  key: string,
  defaultVal: string
): string => {
  const [query, setQuery] = useState(getQueryStringVal(key) || defaultVal);

  return query;
};

export default useQueryParam;