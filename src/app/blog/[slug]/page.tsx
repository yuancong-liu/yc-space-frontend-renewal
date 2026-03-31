type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;

  return (
    <div>
      <h1>Blog Post: {slug}</h1>
    </div>
  );
};

export default BlogPostPage;
