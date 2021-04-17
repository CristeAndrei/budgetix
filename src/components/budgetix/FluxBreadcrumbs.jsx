import React from "react";
import { Breadcrumbs } from "@material-ui/core";
import { Link } from "react-router-dom";
import { ROOT_FLUX } from "../../hooks/useFlux.jsx";
import { useSelector } from "react-redux";

export default function FluxBreadcrumbs({ type }) {
  const { flux } = useSelector(({ fluxes }) => fluxes);
  let path =
    JSON.stringify(flux) === JSON.stringify(ROOT_FLUX) ? [] : [ROOT_FLUX];
  if (flux) path = [...path, ...flux.path];

  return (
    <Breadcrumbs separator="›" aria-label="breadcrumb">
      {path.map((flux, index) => (
        <Link
          key={flux.id}
          to={{
            pathname: flux.id ? `/${type}/${flux.id}` : "/",
            state: { flux: { ...flux, path: path.slice(1, index) } },
          }}
          style={{ textDecoration: "none", color: "Black" }}
        >
          {flux.name}
        </Link>
      ))}
      {flux && <span>{flux.name}</span>}
    </Breadcrumbs>
  );
}
