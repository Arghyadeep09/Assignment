/* eslint-disable react/prop-types */
const SearchBox = ({ searchQuery, setSearchQuery }) => {
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search for team members..."
        className="search-input"
        value={searchQuery}
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchBox;
