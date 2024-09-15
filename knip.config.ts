export default {
  $schema: 'https://unpkg.com/knip@5/schema.json',
  entry: ['src/index.ts!', 'tests/**/*.ts'],
  project: ['src/**/*.ts!', 'tests/**/*.js'],
}
