import type { ComponentProps } from 'react';

import { STANDALONE_IMAGE_ATTRIBUTE } from '../../plugins/remark-standalone-images';

type PostImageProps = ComponentProps<'img'> & {
  [STANDALONE_IMAGE_ATTRIBUTE]?: string;
};

/**
 * An image on a line of its own becomes a figure, so the alt text doubles as a
 * visible caption (a `title` — `![alt](src "caption")` — wins when both are
 * given). An image inside a sentence stays a plain `<img>`: a `<figure>` cannot
 * legally sit inside a paragraph.
 */
export const PostImage = ({
  alt,
  title,
  [STANDALONE_IMAGE_ATTRIBUTE]: standalone,
  ...props
}: PostImageProps) => {
  const image = <img alt={alt ?? ''} loading='lazy' title={title} {...props} />;

  if (!standalone) return image;

  const caption = title ?? alt;

  return (
    <figure className='yc-figure'>
      {image}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
};
