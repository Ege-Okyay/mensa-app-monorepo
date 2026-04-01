import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("mensa/:slug", "routes/mensa.tsx")
] satisfies RouteConfig;
