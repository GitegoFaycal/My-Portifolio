// Local / traditional server entry point. On Vercel, api/index.js is used instead.
import 'dotenv/config';

const { default: app } = await import('./app.js');
const { storageName } = await import('./store.js');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT} (storage: ${storageName})`);
});
