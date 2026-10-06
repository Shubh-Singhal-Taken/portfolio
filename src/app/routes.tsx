import type { RouteRecord } from "vite-react-ssg";
import { LENSES, projects } from "./content";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import LensPage from "./pages/LensPage";
import NotFound from "./pages/NotFound";
import ProjectPage from "./pages/ProjectPage";

/* Every route here is prerendered to its own HTML file at build time
   (software.html, ai.html, ...), served at a clean URL by the host. */

export const routes: RouteRecord[] = [
  {
    path: "/",
    element: <Layout />,
    entry: "src/app/Layout.tsx",
    children: [
      { index: true, element: <HomePage />, entry: "src/app/pages/HomePage.tsx" },
      ...LENSES.map((lens) => ({
        path: lens,
        element: <LensPage lens={lens} />,
        entry: "src/app/pages/LensPage.tsx",
      })),
      {
        path: "projects/:slug",
        element: <ProjectPage />,
        entry: "src/app/pages/ProjectPage.tsx",
        // One prerendered page per project
        getStaticPaths: () => projects.map((p) => `projects/${p.slug}`),
      },
      { path: "404", element: <NotFound />, entry: "src/app/pages/NotFound.tsx" },
      { path: "*", element: <NotFound /> },
    ],
  },
];
