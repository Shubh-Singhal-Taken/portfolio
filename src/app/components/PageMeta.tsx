import { Head } from "vite-react-ssg";
import { identity } from "../content";

type Props = {
  title: string;
  description: string;
  /** Site-relative path of this page, e.g. "/software". */
  path: string;
  /** Site-relative 1200×630 link-preview image; defaults to the front page's. */
  image?: string;
  /** schema.org data for this page (see lib/structuredData.ts). */
  structuredData?: object;
  /** Keep the page out of search results (404). */
  noindex?: boolean;
};

/* Per-page document head, written into each prerendered HTML file so
   search engines and link previews see the right title, summary, image
   and structured data for that page, not one shared set for the site. */

export default function PageMeta({
  title,
  description,
  path,
  image = "/og/home.jpg",
  structuredData,
  noindex,
}: Props) {
  const url = `${identity.site}${path === "/" ? "/" : path}`;
  const imageUrl = `${identity.site}${image}`;

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
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* "<" is escaped so content can never close the script tag early */}
      {structuredData ? (
        <script type="application/ld+json">
          {JSON.stringify(structuredData).replace(/</g, "\\u003c")}
        </script>
      ) : null}
    </Head>
  );
}
