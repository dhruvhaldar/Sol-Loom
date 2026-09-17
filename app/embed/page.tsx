import SolarExperience from '@/components/SolarLoader';

export const metadata = { title: 'Embed — Sol Loom', robots: { index: false, follow: false } };

export default function EmbedPage() {
  return <SolarExperience embedded />;
}
