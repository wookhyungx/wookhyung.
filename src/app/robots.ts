import type { MetadataRoute } from 'next';

import { siteConfig } from '@/shared/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
