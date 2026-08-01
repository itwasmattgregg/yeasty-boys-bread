import dynamic from 'next/dynamic';

const DesignTool = dynamic(() => import('../components/DesignTool'), {
  ssr: false,
});

export default function DesignPage() {
  return <DesignTool />;
}
