import React from "react";
import { useParams } from "react-router-dom";
import FieldDetailPage from "./index";
import FieldUniversityDetailPage from "./FieldUniversityDetailPage";

export default function FieldSlugRouter() {
  const { slug } = useParams();

  if (slug.includes("+")) {
    return <FieldUniversityDetailPage />;
  }

  return <FieldDetailPage />;
}
