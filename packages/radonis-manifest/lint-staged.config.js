module.exports = {
  '*.{ts,tsx}': ['pnpm run lint -- --fix'],
  '*.{json,md}': ['pnpm run format'],
}
