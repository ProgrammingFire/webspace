"use client";

import React from "react";
import StarRatings from "react-star-ratings";
interface SolutionRatingProps {
  initialValue: number;
}

function SolutionRating({ initialValue }: SolutionRatingProps) {
  return (
    <StarRatings
      rating={initialValue}
      starRatedColor="#8e79e0"
      starEmptyColor="#37414f"
    />
  );
}

export default SolutionRating;
