import fetch from 'node-fetch';

const { DEFAULT_BRANCH: defaultBranch = 'develop' } = process.env;
const root = 'https://github.com';
const repo = {
  owner: 'dequelabs',
  repo: 'cauldron'
};

export function getEditUrl(filepath: string): string {
  return `${root}/${repo.owner}/${repo.repo}/edit/${defaultBranch}/${filepath}`;
}
