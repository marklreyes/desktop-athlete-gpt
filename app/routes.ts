import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
	layout("./components/Layout.tsx", [
		index("routes/home.tsx"),
		route("chat", "routes/chat.tsx"),
		route("about", "routes/about.tsx"),
		route("workout", "routes/workout.tsx"),
	]),
] satisfies RouteConfig;
