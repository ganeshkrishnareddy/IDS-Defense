import IDSDashboard from '@/components/IDSDashboard';

export const metadata = {
  title: 'IDS Defense Dashboard',
  description: 'Real-time Intrusion Detection System with Machine Learning',
};

export default function Home() {
  return (
    <main>
      <IDSDashboard />
    </main>
  );
}
