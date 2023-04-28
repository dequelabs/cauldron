import slugify from 'slugify';

export default function(text: string) {
  return slugify(text, { lower: true });
}
