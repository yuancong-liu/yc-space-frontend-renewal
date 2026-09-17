type UnknownDirectiveProps = {
  name?: string;
};

export const UnknownDirective = ({ name }: UnknownDirectiveProps) => (
  <p className="yc-markdown-error">
    Unknown block <code>::{name}</code> — check the name against the directives
    this renderer knows about.
  </p>
);
