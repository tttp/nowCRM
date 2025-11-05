// src/bootstrap/config.ts

interface JourneysConfig {
    NODE_ENV: string | undefined;
    CUSTOMER_DOMAIN: string;
    JOURNEYS_PORT: string;
    JOURNEYS_HOST: string;
  }
  
  let CONFIG: JourneysConfig | null = null;
  
  if (process.env.NT_ACTIVE_SERVICES?.includes("journeys")) {
    if (!process.env.JOURNEYS_PORT || !process.env.JOURNEYS_HOST) {
      throw new Error("Missing environment variables for setting up webhooks");
    }
  
    if (!process.env.CUSTOMER_DOMAIN) {
      throw new Error("Missing customer domain");
    }
  
    CONFIG = {
      NODE_ENV: process.env.NODE_ENV,
      CUSTOMER_DOMAIN: process.env.CUSTOMER_DOMAIN,
      JOURNEYS_PORT: process.env.JOURNEYS_PORT,
      JOURNEYS_HOST: process.env.JOURNEYS_HOST,
    };
  }
  
  export { CONFIG };
  