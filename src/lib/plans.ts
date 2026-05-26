export type PlanId = "free" | "warrior" | "elite" | "champion" | "legend";

export type PlanLimits = {
  workflows: number;
  dashboards: number;
  nodesPerWorkflow: number;
  collaborators: number;
  sharedWorkflows: number;
  customElements: number;
  favorites: number;
  versionHistory: number;
  aiCredits: number;
  exports: string[];
  integrations: boolean;
  prioritySupport: boolean;
};

export const planOrder: PlanId[] = ["free", "warrior", "elite", "champion", "legend"];

export const planLimits: Record<PlanId, PlanLimits> = {
  free: {
    workflows: 3,
    dashboards: 1,
    nodesPerWorkflow: 50,
    collaborators: 0,
    sharedWorkflows: 1,
    customElements: 2,
    favorites: 5,
    versionHistory: 5,
    aiCredits: 25,
    exports: ["json"],
    integrations: false,
    prioritySupport: false
  },
  warrior: {
    workflows: 20,
    dashboards: 5,
    nodesPerWorkflow: 250,
    collaborators: 3,
    sharedWorkflows: 10,
    customElements: 10,
    favorites: 20,
    versionHistory: 25,
    aiCredits: 500,
    exports: ["json", "png"],
    integrations: false,
    prioritySupport: false
  },
  elite: {
    workflows: 75,
    dashboards: 20,
    nodesPerWorkflow: 1000,
    collaborators: 10,
    sharedWorkflows: 40,
    customElements: 50,
    favorites: 50,
    versionHistory: 100,
    aiCredits: 2500,
    exports: ["json", "png", "svg", "pdf"],
    integrations: true,
    prioritySupport: false
  },
  champion: {
    workflows: 250,
    dashboards: 75,
    nodesPerWorkflow: 5000,
    collaborators: 30,
    sharedWorkflows: 150,
    customElements: 200,
    favorites: 150,
    versionHistory: 500,
    aiCredits: 10000,
    exports: ["json", "png", "svg", "pdf"],
    integrations: true,
    prioritySupport: true
  },
  legend: {
    workflows: 1000,
    dashboards: 250,
    nodesPerWorkflow: 20000,
    collaborators: 100,
    sharedWorkflows: 1000,
    customElements: 1000,
    favorites: 1000,
    versionHistory: 2000,
    aiCredits: 50000,
    exports: ["json", "png", "svg", "pdf"],
    integrations: true,
    prioritySupport: true
  }
};

export function canUseResource(plan: PlanId, key: keyof PlanLimits, used: number) {
  const limit = planLimits[plan][key];
  return typeof limit === "number" ? used < limit : true;
}
