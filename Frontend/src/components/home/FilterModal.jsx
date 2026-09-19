import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "../../css/FilterModal.css";
import "react-input-range/lib/css/index.css";
import InputRange from "react-input-range";

const MIN_PRICE = 600;
const MAX_PRICE = 30000;

const FilterModal = ({ selectedFilters, onFilterChange, onClose }) => {
  const [priceRange, setPriceRange] = useState({
    min: MIN_PRICE,
    max: MAX_PRICE,
  });

  const [propertyType, setPropertyType] = useState("");
  const [roomType, setRoomType] = useState("");
  const [amenities, setAmenities] = useState([]);

  useEffect(() => {
    let min = Number(selectedFilters?.minPrice) || MIN_PRICE;
    let max = Number(selectedFilters?.maxPrice) || MAX_PRICE;

    // Keep values inside InputRange limits
    min = Math.max(MIN_PRICE, Math.min(min, MAX_PRICE));
    max = Math.max(MIN_PRICE, Math.min(max, MAX_PRICE));

    // Make sure min is never greater than max
    if (min > max) {
      min = MIN_PRICE;
      max = MAX_PRICE;
    }

    setPriceRange({
      min,
      max,
    });

    setPropertyType(selectedFilters?.propertyType || "");
    setRoomType(selectedFilters?.roomType || "");
    setAmenities(
      Array.isArray(selectedFilters?.amenities)
        ? selectedFilters.amenities
        : []
    );
  }, [
    selectedFilters?.minPrice,
    selectedFilters?.maxPrice,
    selectedFilters?.propertyType,
    selectedFilters?.roomType,
    selectedFilters?.amenities,
  ]);

  // PRICE RANGE SLIDER
  const handlePriceRangeChange = (value) => {
    setPriceRange({
      min: Math.max(MIN_PRICE, Math.min(value.min, MAX_PRICE)),
      max: Math.max(MIN_PRICE, Math.min(value.max, MAX_PRICE)),
    });
  };

  // MIN PRICE INPUT
  const handleMinInputChange = (e) => {
    let minValue = Number(e.target.value);

    if (Number.isNaN(minValue)) {
      minValue = MIN_PRICE;
    }

    minValue = Math.max(MIN_PRICE, Math.min(minValue, priceRange.max));

    setPriceRange((prev) => ({
      ...prev,
      min: minValue,
    }));
  };

  // MAX PRICE INPUT
  const handleMaxInputChange = (e) => {
    let maxValue = Number(e.target.value);

    if (Number.isNaN(maxValue)) {
      maxValue = MAX_PRICE;
    }

    maxValue = Math.min(MAX_PRICE, Math.max(maxValue, priceRange.min));

    setPriceRange((prev) => ({
      ...prev,
      max: maxValue,
    }));
  };

  // PROPERTY TYPE
  const handlePropertyTypeChange = (selectedType) => {
    setPropertyType((prevType) =>
      prevType === selectedType ? "" : selectedType
    );
  };

  // ROOM TYPE
  const handleRoomTypeChange = (selectedType) => {
    setRoomType((prevType) =>
      prevType === selectedType ? "" : selectedType
    );
  };

  // AMENITIES
  const handleAmenitiesChange = (selectedAmenity) => {
    setAmenities((prevAmenities) =>
      prevAmenities.includes(selectedAmenity)
        ? prevAmenities.filter((item) => item !== selectedAmenity)
        : [...prevAmenities, selectedAmenity]
    );
  };

  // APPLY FILTERS
  const handleFilterChange = () => {
    const filters = {
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
      propertyType: propertyType,
      roomType: roomType,
      amenities: amenities,
    };

    console.log("FILTERS BEING APPLIED:", filters);

    onFilterChange(filters);

    onClose();
  };

  // CLEAR FILTERS
  const handleClearFilters = () => {
    setPriceRange({
      min: MIN_PRICE,
      max: MAX_PRICE,
    });

    setPropertyType("");
    setRoomType("");
    setAmenities([]);

    // Clear Redux filters immediately
    onFilterChange({
      minPrice: MIN_PRICE,
      maxPrice: MAX_PRICE,
      propertyType: "",
      roomType: "",
      amenities: [],
    });
  };

  const propertyTypeOptions = [
    {
      value: "House",
      label: "House",
      icon: "home",
    },
    {
      value: "Flat",
      label: "Flat",
      icon: "apartment",
    },
    {
      value: "Guest House",
      label: "Guest House",
      icon: "hotel",
    },
    {
      value: "Hotel",
      label: "Hotel",
      icon: "meeting_room",
    },
  ];

  const roomTypeOptions = [
    {
      value: "Entire Home",
      label: "Entire Home",
      icon: "hotel",
    },
    {
      value: "Room",
      label: "Room",
      icon: "meeting_room",
    },
    {
      value: "Anytype",
      label: "Any Type",
      icon: "apartment",
    },
  ];

  const amenitiesOptions = [
    {
      value: "Wifi",
      label: "Wi-Fi",
      icon: "wifi",
    },
    {
      value: "Kitchen",
      label: "Kitchen",
      icon: "kitchen",
    },
    {
      value: "AC",
      label: "AC",
      icon: "ac_unit",
    },
    {
      value: "Washing Machine",
      label: "Washing Machine",
      icon: "local_laundry_service",
    },
    {
      value: "TV",
      label: "TV",
      icon: "tv",
    },
    {
      value: "pool",
      label: "Pool",
      icon: "pool",
    },
    {
      value: "Free Parking",
      label: "Free Parking",
      icon: "local_parking",
    },
  ];

  return (
    <div className="modal-backdrop">
      <div className="modal-content">

        <h4>
          Filters <hr />
        </h4>

        <button
          className="close-button"
          onClick={onClose}
        >
          <span>&times;</span>
        </button>

        <div className="modal-filters-container">

          {/* PRICE */}

          <div className="filter-section">
            <label>Price Range:</label>

            <InputRange
              minValue={MIN_PRICE}
              maxValue={MAX_PRICE}
              value={priceRange}
              onChange={handlePriceRangeChange}
            />

            <div className="range-inputs">

              <input
                type="number"
                min={MIN_PRICE}
                max={MAX_PRICE}
                value={priceRange.min}
                onChange={handleMinInputChange}
              />

              <span>-</span>

              <input
                type="number"
                min={MIN_PRICE}
                max={MAX_PRICE}
                value={priceRange.max}
                onChange={handleMaxInputChange}
              />

            </div>
          </div>

          {/* PROPERTY TYPE */}

          <div className="filter-section">
            <label>Property Type:</label>

            <div className="icon-box">

              {propertyTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`selectable-box ${
                    propertyType === option.value
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handlePropertyTypeChange(option.value)
                  }
                >
                  <span className="material-icons">
                    {option.icon}
                  </span>

                  <span>
                    {option.label}
                  </span>
                </div>
              ))}

            </div>
          </div>

          {/* ROOM TYPE */}

          <div className="filter-section">
            <label>Room Type:</label>

            <div className="icon-box">

              {roomTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`selectable-box ${
                    roomType === option.value
                      ? "selected"
                      : ""
                  }`}
                  onClick={() =>
                    handleRoomTypeChange(option.value)
                  }
                >
                  <span className="material-icons">
                    {option.icon}
                  </span>

                  <span>
                    {option.label}
                  </span>
                </div>
              ))}

            </div>
          </div>

          {/* AMENITIES */}

          <div className="filter-section">
            <label>Amenities:</label>

            <div className="amenities-checkboxes">

              {amenitiesOptions.map((option) => (
                <div
                  key={option.value}
                  className="amenity-checkbox"
                >

                  <input
                    type="checkbox"
                    value={option.value}
                    checked={amenities.includes(option.value)}
                    onChange={() =>
                      handleAmenitiesChange(option.value)
                    }
                  />

                  <span className="material-icons amenitieslabel">
                    {option.icon}
                  </span>

                  <span>
                    {option.label}
                  </span>

                </div>
              ))}

            </div>
          </div>

          {/* BUTTONS */}

          <div className="filter-buttons">

            <button
              className="clear-button"
              onClick={handleClearFilters}
            >
              Clear
            </button>

            <button onClick={handleFilterChange}>
              Apply Filters
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

FilterModal.propTypes = {
  selectedFilters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FilterModal;

