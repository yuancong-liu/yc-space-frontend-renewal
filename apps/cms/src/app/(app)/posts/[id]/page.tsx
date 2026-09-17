import { notFound } from 'next/navigation';

import { DeletePostForm } from '@/components/delete-post-button';
import { PostEditor } from '@/components/post-editor';
import { getPostById } from '@/lib/posts';

type EditPostPageProps = {
  params: Promise<{ id: string }>;
};

const EditPostPage = async ({ params }: EditPostPageProps) => {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) notFound();

  return (
    <main className="cms-workbench">
      <PostEditor post={post} />
      <DeletePostForm id={post.id} />
    </main>
  );
};

export default EditPostPage;
