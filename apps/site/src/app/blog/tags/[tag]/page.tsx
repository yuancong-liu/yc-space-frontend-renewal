type TagPageProps = {
  params: Promise<{ tag: string }>;
};

const TagPage = async ({ params }: TagPageProps) => {
  const { tag } = await params;

  return (
    <div>
      <h1>Tag: {tag}</h1>
    </div>
  );
};

export default TagPage;
