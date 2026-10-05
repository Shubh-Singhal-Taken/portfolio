import { Head } from "vite-react-ssg";
import { identity } from "../content";

type Props = {
  title: string;
  description: string;
  /** Site-relative path of this page, e.g. "/software". */
  path: string;
  /** Keep the page out of search results (404). */
  noindex?: boolean;
};

/* Per-page document head, written into each prerendered HTML file so
   search engines and link previews see the right title and summary for
   that page, not one shared set for the whole site. */

export default function PageMeta({ title, description, path, noindex }: Props) {
  const url = `${identity.site}${path === "/" ? "/" : path}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex" />
      ) : (
        <link rel="canonical" href={url} />
      )}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={identity.name} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
}
