import { useState } from "react";
import SearchIcon from "@/assets/search.svg";

const SearchModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="border rounded-md p-2 bg-white sm:hidden"
      >
        <img src={SearchIcon} alt="search" className="w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-md w-11/12 max-w-sm">
            <input
              type="text"
              placeholder="Search"
              className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-white"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="mt-2 w-full bg-primary text-white py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchModal;
