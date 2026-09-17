import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SolarExperience from '@/components/SolarLoader';
import { bodies, bodyBySlug } from '@/lib/bodies';

export function generateStaticParams() {
  return bodies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const body = bodyBySlug(slug);
  if (!body) return {};
  const title = `${body.name} — Sol Loom`;
  return { title, description: body.description, openGraph: { title, description: body.description, images: [] }, twitter: { card: 'summary', title, description: body.description, images: [] } };
}

export default async function BodyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!bodyBySlug(slug)) notFound();
  return <SolarExperience initialSlug={slug} />;
}
