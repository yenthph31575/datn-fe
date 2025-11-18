type Attribute = {
  name: string;
  values: string[];
};

type Variant = {
  sku: string;
  price: number;
  quantity: number;
  soldCount: number;
  attributes: Record<string, string>;
  _id: string;
};

export function groupAttributes(variants: Variant[]): Attribute[] {
  return Object.values(
    variants.reduce((acc: Record<string, Attribute>, variant) => {
      Object.entries(variant.attributes).forEach(([name, value]) => {
        if (acc[name]) {
          if (!acc[name].values.includes(value)) {
            acc[name].values.push(value);
          }
        } else {
          acc[name] = { name, values: [value] };
        }
      });
      return acc;
    }, {})
  );
}
