import { useState } from "react";

const useSearch = onSearch => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = event => {
    const term = event.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return { searchTerm, handleSearchChange, setSearchTerm };
};

export default useSearch;
