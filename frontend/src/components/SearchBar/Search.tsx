import React from "react";
import {filterSortingAtom} from "../../constants/atoms";
import {useRecoilState} from "recoil";

function Search() {
  const [filterSorting, setFilterSorting] = useRecoilState(filterSortingAtom);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterSorting((prevFilterSorting) => ({
      ...prevFilterSorting,
      searchTerm: event.target.value,
    }));
  };

  const ApplySearch = () => {
    console.log('searching...')
  };

  return (
    <>
      <form className="relative flex justify-center h-[54px] -top-[27px] w-full">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only "
        >
          Search
        </label>
        <div className="relative w-3/4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 "
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="search"
            id="default-search"
            value={filterSorting.searchTerm}
            onChange={handleFilterChange}
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for job postings..."
            required
          />
          <button
            type="submit"
            onClick={ApplySearch}
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
          >
            Search
          </button>
        </div>
      </form>
    </>
  )
}

export default Search;
