import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';

import { siteConfig } from '@/shared/config/site';
import { openGraph, twitter } from '@/shared/util/seo';

import { RSS_FEEDS } from './config/rss-feeds';
import { parseAllRssFeeds } from './model/rss-parser';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Feed | WOOKHYUNG.',
  openGraph: openGraph({
    title: `Feed | ${siteConfig.siteName}`,
  }),
  twitter: twitter({
    title: `Feed | ${siteConfig.siteName}`,
  }),
};

export default async function FeedPage() {
  const rssItems = await parseAllRssFeeds(RSS_FEEDS);

  return (
    <div className="px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Feed (Beta ⚠️)</h1>

      <div>
        {rssItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">RSS 피드를 불러오는 중...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {rssItems.map((item, index) => (
              <article
                key={`${item.feedUrl}-${index}`}
                className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm text-blue-600">
                      {item.feedName}
                    </span>
                  </div>
                  <time className="text-sm text-gray-500">
                    {format(new Date(item.pubDate), 'MM월 dd일', {
                      locale: ko,
                    })}
                  </time>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 transition-colors"
                  >
                    {item.title}
                  </a>
                </h3>
                {item.contentSnippet && (
                  <p className="text-gray-600 text-sm mb-3">
                    {item.contentSnippet}...
                  </p>
                )}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:underline"
                >
                  전체 글 읽기 <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
