import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("mensa/:slug", "routes/mensa-page.tsx"),
  route("privacy", "routes/privacy.tsx"),
  route("terms", "routes/terms.tsx")
] satisfies RouteConfig;
