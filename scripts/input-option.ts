import type { select } from '@inquirer/prompts';

type SelectOption = Parameters<typeof select>[0];

export const releaseTypeSelectOption: SelectOption = {
  message: 'Select release type',
  choices: [
    {
      name: 'major',
      value: 'major',
      description: 'major release',
    },
    {
      name: 'minor',
      value: 'minor',
      description: 'minor release',
    },
    {
      name: 'patch',
      value: 'patch',
      description: 'patch release',
    },
    {
      name: 'alpha',
      value: 'alpha',
      description: 'alpha release',
    },
  ]
};
