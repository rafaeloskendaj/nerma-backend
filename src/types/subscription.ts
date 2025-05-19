export interface ISubscriptionPlan {
    name: string;
    price: number;
    features: string[];
    tier: "basic" | "premium" | "premium+";
  }
  