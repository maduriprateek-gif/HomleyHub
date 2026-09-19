const PropertyAmenities = ({ amenities = [] }) => {
  return (
    <div>
      <h2>Amenities</h2>

      <div className="amenities-container">
        {amenities.map((amenity) => (
          <div className="amenity" key={amenity._id}>
            <span className="material-symbols-outlined">
              {amenity.icon}
            </span>

            <span>{amenity.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyAmenities;