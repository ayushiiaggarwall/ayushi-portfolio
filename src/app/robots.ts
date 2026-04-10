import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/api/', // Keep APIs private from basic search crawlers
    },
    sitemap: 'https://ayushiaggarwal.tech/sitemap.xml',
  };
}
