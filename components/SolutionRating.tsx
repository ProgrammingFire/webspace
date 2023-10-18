"use client";

import React from "react";
import StarRatings from "react-star-ratings";
interface SolutionRatingProps {
  initialValue: number;
}

function SolutionRating({ initialValue }: SolutionRatingProps) {
  return <StarRatings rating={initialValue} starRatedColor="#6D28D9" />;
}

export default SolutionRating;
