export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_Se9ib5L2BjsGEL',
    priceId: 'price_1RirObHS9ff337QLCFAAHvLl',
    name: 'CodeReview Pro',
    description: 'For growing teams that need advanced features',
    mode: 'subscription'
  },
  {
    id: 'prod_Se9jE4uO0qPFyK',
    priceId: 'price_1RirPkHS9ff337QL0G7ke7Zw',
    name: 'Enterprise',
    description: 'For large organizations with custom requirements',
    mode: 'subscription'
  }
];

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.priceId === priceId);
}

export function getProductByName(name: string): StripeProduct | undefined {
  return stripeProducts.find(product => product.name === name);
}