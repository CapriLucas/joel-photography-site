import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "dvhf52ob",
    dataset: "production",
  },
  deployment: {
    autoUpdates: true,
    appId: "vh9stfdiylo0qztxmoiwegeh",
  },
});
