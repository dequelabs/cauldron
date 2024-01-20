import { JestAxe, configureAxe } from 'jest-axe';

const axe: JestAxe = configureAxe({
  rules: {
    region: { enabled: false }
  }
});

export default axe;
