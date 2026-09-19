import React, { useState } from "react";
import FilterModal from "./FilterModal";

import { useDispatch } from "react-redux";
import { propertyAction } from "../../store/Property/property-slice";
import { getAllProperties } from "../../store/Property/property-action";

const Filter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});

  const dispatch = useDispatch();

  const handleShowAllPhotos = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFilterChange = (filters) => {
    console.log("UPDATED FILTERS:", filters);

    setSelectedFilters(filters);

    // Update Redux search parameters
    dispatch(
      propertyAction.updateSearchParams(filters)
    );

    // Fetch properties using the filters
    dispatch(
      getAllProperties(filters)
    );
  };

  return (
    <>
      <span
        className="material-symbols-outlined filter"
        onClick={handleShowAllPhotos}
      >
        tune
      </span>

      {isModalOpen && (
        <FilterModal
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default Filter;

