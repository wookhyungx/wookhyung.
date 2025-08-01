import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMDXComponent } from 'next-contentlayer2/hooks';
import serialize from 'serialize-javascript';

import { siteConfig } from '@/shared/config/site';
import { allPosts } from '@/shared/util/post';
import { openGraph, twitter } from '@/shared/util/seo';

import { Comments } from './ui/comments';
import ProgressBar from './ui/progress-bar';
import ScrollToTop from './ui/scroll-to-top';

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export const generateStaticParams = () =>
  allPosts.map((post) => ({ slug: post._raw.flattenedPath }));

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  if (!post) {
    throw new Error(`Post not found for slug: ${slug}`);
  }

  return {
    title: post.title,
    description: post.summary,
    alternates: {
      canonical: `${siteConfig.url}/blog/${slug}`,
    },
    openGraph: openGraph({
      title: post.title,
    }),
    twitter: twitter({
      title: post.title,
    }),
  };
};

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = allPosts.find((post) => post._raw.flattenedPath === slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    url: `${siteConfig.url}/blog/${slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/blog/${slug}`,
    },
  };

  const Content = getMDXComponent(post.body.code);

  return (
    <>
      <div className="flex flex-col gap-6 pb-40 font-pretendard">
        <ProgressBar />
        <article className="py-6 prose max-w-none break-words">
          <h1>{post.title}</h1>
          {post.summary && (
            <p className="text-xl mt-0 text-slate-700">{post.summary}</p>
          )}
          <hr />
          <Content
            components={{
              Image,
            }}
          />
        </article>
        <Comments />
        <ScrollToTop />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(jsonLd) }}
      />
    </>
  );
}
