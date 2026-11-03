// Public address of the site, used for links in previews, the sitemap and search engines.
// On Vercel it follows the project's production domain, a custom domain included once it
// is connected. Setting SITE_URL overrides it on any host. Server-side code only.
export const SITE_URL = process.env.SITE_URL
  ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://said-freres-technologies.netlify.app");
