import { createProductionServer } from './server-app.mjs';

// Managed hosts import the entry file, so startup must not depend on argv/main.
const port = Number(process.env.PORT || 3000);
createProductionServer().listen(port, '0.0.0.0', () => {
  console.log(`ProRack website and RackBot API listening on port ${port}`);
  if (!process.env.BOLNA_API_KEY || !process.env.BOLNA_AGENT_ID) console.warn('RackBot requires BOLNA_API_KEY and BOLNA_AGENT_ID at runtime.');
});
