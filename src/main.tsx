import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./app/routes";
import "./styles/index.css";

/* Built by `vite-react-ssg build`: every route is rendered to static HTML,
   then hydrated in the browser. */
export const createRoot = ViteReactSSG({
  routes,
  basename: import.meta.env.BASE_URL,
});
