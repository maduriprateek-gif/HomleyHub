class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // FILTER
  filter() {
    const filterQuery = {};
    const queryObj = { ...this.queryString };

    // -------------------------
    // PRICE
    // -------------------------
    if (queryObj.minPrice || queryObj.maxPrice) {
      const priceFilter = {};

      if (queryObj.minPrice) {
        priceFilter.$gte = Number(queryObj.minPrice);
      }

      if (
        queryObj.maxPrice &&
        !String(queryObj.maxPrice).includes(">")
      ) {
        priceFilter.$lte = Number(queryObj.maxPrice);
      }

      filterQuery.price = priceFilter;
    }

    // -------------------------
    // PROPERTY TYPE
    // -------------------------
    if (
      queryObj.propertyType &&
      queryObj.propertyType !== "Anytype" &&
      queryObj.propertyType !== "Any Type"
    ) {
      const propertyTypeArray = Array.isArray(queryObj.propertyType)
        ? queryObj.propertyType
        : String(queryObj.propertyType)
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);

      if (propertyTypeArray.length > 0) {
        filterQuery.propertyType = {
          $in: propertyTypeArray,
        };
      }
    }

    // -------------------------
    // ROOM TYPE
    // -------------------------
    if (
      queryObj.roomType &&
      queryObj.roomType !== "Anytype" &&
      queryObj.roomType !== "Any Type"
    ) {
      filterQuery.roomType = queryObj.roomType;
    }

    // -------------------------
    // AMENITIES
    // -------------------------
    if (queryObj.amenities) {
      let amenitiesArray = Array.isArray(queryObj.amenities)
        ? queryObj.amenities
        : String(queryObj.amenities)
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean);

      // Remove empty values
      amenitiesArray = amenitiesArray.filter(
        (amenity) => amenity && amenity !== "undefined"
      );

      if (amenitiesArray.length > 0) {
        filterQuery["amenities.name"] = {
          $all: amenitiesArray,
        };
      }
    }

    console.log("MONGODB FILTER:", JSON.stringify(filterQuery, null, 2));

    this.query = this.query.find(filterQuery);

    return this;
  }

  // SEARCH
  search() {
    const searchQuery = {};
    const queryObj = { ...this.queryString };

    // -------------------------
    // CITY
    // -------------------------
    if (queryObj.city) {
      const city = String(queryObj.city)
        .toLowerCase()
        .replaceAll(" ", "");

      searchQuery.$or = [
        { "address.city": city },
        { "address.state": city },
        { "address.area": city },
      ];
    }

    // -------------------------
    // GUESTS
    // -------------------------
    if (queryObj.guests) {
      searchQuery.maximumGuest = {
        $gte: Number(queryObj.guests),
      };
    }

    // -------------------------
    // DATES
    // -------------------------
    if (queryObj.dateIn && queryObj.dateOut) {
      searchQuery.currentBookings = {
        $not: {
          $elemMatch: {
            fromDate: {
              $lt: queryObj.dateOut,
            },
            toDate: {
              $gt: queryObj.dateIn,
            },
          },
        },
      };
    }

    console.log(
      "MONGODB SEARCH:",
      JSON.stringify(searchQuery, null, 2)
    );

    this.query = this.query.find(searchQuery);

    return this;
  }

  // PAGINATION
  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 12;

    const skip = (page - 1) * limit;

    this.query = this.query
      .skip(skip)
      .limit(limit);

    return this;
  }
}

export { APIFeatures };