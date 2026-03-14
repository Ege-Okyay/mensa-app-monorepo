import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/index.tsx"),
  route("test", "routes/home-test.tsx")
] satisfies RouteConfig;
