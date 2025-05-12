import { useState } from 'react';
import { useUserMe } from '@/hooks/useUserMe';
import toast from 'react-hot-toast';
import { TagsInput } from '@components/forms/TagsInput';

export const TagEditor = () => {
  const { tags, addTag, removeTag } = useUserMe();
  const [submitting, setSubmitting] = useState(false);

  const tagNames = tags.map((t) => t.name);

  const handleChange = async (newTags: string[]) => {
    setSubmitting(true);
    const toAdd = newTags.filter((t) => !tagNames.includes(t));
    const toRemove = tagNames.filter((t) => !newTags.includes(t));

    try {
      await Promise.all([
        ...toAdd.map(async (tag) => {
          try {
            await addTag(tag);
            toast.success(`Added "${tag}"`);
          } catch {
            toast.error(`Failed to add "${tag}"`);
          }
        }),
        ...toRemove.map(async (tag) => {
          try {
            await removeTag(tag);
            toast.success(`Removed "${tag}"`);
          } catch {
            toast.error(`Failed to remove "${tag}"`);
          }
        }),
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">Tags</h3>
      <TagsInput
        value={tagNames}
        onChange={handleChange}
        disabled={submitting}
        label="Your Tags"
        allowCustomTags
      />
    </div>
  );
};
