import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', '.omc', 'playwright-report', 'test-results'] },
  ...tseslint.configs.recommended,
  { plugins: { 'react-hooks': reactHooks }, rules: reactHooks.configs.recommended.rules },
)
