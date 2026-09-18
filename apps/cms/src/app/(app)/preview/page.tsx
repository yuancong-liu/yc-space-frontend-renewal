import { SAMPLE_POST } from '@yc/markdown/sample';

import { PreviewWorkbench } from '@/components/preview-workbench';

const PreviewPage = () => (
  <main className='cms-workbench'>
    <PreviewWorkbench initialSource={SAMPLE_POST} />
  </main>
);

export default PreviewPage;
