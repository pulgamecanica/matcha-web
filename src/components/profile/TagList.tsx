import { Tag } from '@/types/tag';

type Props = {
  tags: Tag[];
};

export function TagList({ tags }: Props) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map(tag => (
        <span
          key={tag.id}
          className="px-3 py-1 rounded-full bg-purple-200 text-purple-800 text-xs font-medium dark:bg-purple-900 dark:text-purple-100"
        >
          #{tag.name}
        </span>
      ))}
    </div>
  );
}
