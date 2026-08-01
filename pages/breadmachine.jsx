import dynamic from 'next/dynamic';

const BreadMachine = dynamic(() => import('../components/BreadMachine'), {
  ssr: false,
});

export default function BreadMachinePage() {
  return <BreadMachine />;
}
