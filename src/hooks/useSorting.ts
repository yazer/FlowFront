import { useCallback, useEffect, useState } from "react";

const defaultSort: { sort: string; direction: "asc" | "desc" } = {
  sort: "",
  direction: "asc",
};

function useSorting(sorting = defaultSort) {
  const [sorts, setSorts] = useState<{
    sort: string;
    direction: "asc" | "desc";
  }>(sorting);
  const [sortQuery, setSortQuery] = useState("");

  useEffect(() => {
    if (sorts.sort && sorts.direction) {
      setSortQuery(`sort=${sorts.sort}&direction=${sorts.direction}`);
    } else {
      setSortQuery("");
    }
  }, [sorts]);
  const onHandleSort = useCallback(
    (sort: string, direction: "asc" | "desc") => {
      setSorts({ sort, direction });
    },
    []
  );
  return {
    sorting: sorts,
    onHandleSort,
    sortQuery,
  };
}
export { useSorting };
