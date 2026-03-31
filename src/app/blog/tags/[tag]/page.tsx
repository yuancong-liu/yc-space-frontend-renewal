type TagPageProps = {
  params: Promise<{ tag: string }>;
};

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;

  return (
    <div>
      <h1>Tag: {tag}</h1>
    </div>
  );
}
