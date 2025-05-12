import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchAllTags } from "@/api/tags";

type TagsInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
  label?: string;
  allowCustomTags?: boolean;
};

export function TagsInput({
  value,
  onChange,
  disabled = false,
  label = "Tags",
  allowCustomTags = false,
}: TagsInputProps) {
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchAllTags()
      .then(setAllTags)
      .catch(() => toast.error("Failed to load tags"));
  }, []);

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      freeSolo={allowCustomTags}
      options={allTags}
      disabled={disabled}
      value={value}
      onChange={(_, newTags) => onChange(newTags)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={allowCustomTags ? "Add or select tags" : "Select tags"}
          InputLabelProps={{
            className: "text-gray-900 dark:text-white",
          }}
          InputProps={{
            ...params.InputProps,
            className: "bg-white dark:bg-gray-700 text-black dark:text-white rounded",
          }}
        />
      )}
      className="dark:text-white my-4"
    />
  );
}
