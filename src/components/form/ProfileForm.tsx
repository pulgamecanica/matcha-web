import React, { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import FormInput from '@components/form/FormInput';
import FormSelect from '@components/form/FormSelect';
import FormYear from '@components/form/FormYear';

type ProfileFormProps = {
  onSubmit: (data: {
    username: string;
    first_name: string;
    last_name: string;
    gender: 'male' | 'female' | 'other';
    sexual_preferences: 'male' | 'female' | 'non_binary' | 'everyone';
    biography: string;
    birth_year: number;
  }) => void;
  buttonText?: string;
};

export const ProfileForm = ({ onSubmit, buttonText = 'Save' }: ProfileFormProps) => {
  const { user } = useAuth();

  const [username, setUsername] = useState(user?.username || '');
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [sexualPreferences, setSexualPreferences] = useState(user?.sexual_preferences || '');
  const [biography, setBiography] = useState(user?.biography || '');
  const [birthYear, setBirthYear] = useState<number | ''>(user?.birth_year || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      username,
      first_name: firstName,
      last_name: lastName,
      gender: gender as 'male' | 'female' | 'other',
      sexual_preferences: sexualPreferences as 'male' | 'female' | 'non_binary' | 'everyone',
      biography,
      birth_year: Number(birthYear),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <FormInput
        label="Username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <FormInput
        label="First Name"
        name="first_name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <FormInput
        label="Last Name"
        name="last_name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <FormSelect
        label="Gender"
        name="gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        options={['male', 'female', 'other']}
        required
      />
      <FormSelect
        label="Sexual Preferences"
        name="sexual_preferences"
        value={sexualPreferences}
        onChange={(e) => setSexualPreferences(e.target.value)}
        options={['male', 'female', 'non_binary', 'everyone']}
        required
      />
      <FormInput
        label="Biography"
        name="biography"
        value={biography}
        onChange={(e) => setBiography(e.target.value)}
        placeholder="Tell us a little about yourself"
      />
      <FormYear
        label="Birth Year"
        name="birth_year"
        value={birthYear}
        onChange={setBirthYear}
        required
      />
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md mt-4"
      >
        {buttonText}
      </button>
    </form>
  );
};
