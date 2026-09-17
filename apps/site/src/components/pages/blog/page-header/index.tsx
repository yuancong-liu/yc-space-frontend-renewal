type PageHeaderProps = {
  children: string;
};

export const PageHeader = ({ children }: PageHeaderProps) => (
  <header className="blog-page-header">
    <h1>{children}</h1>
  </header>
);
