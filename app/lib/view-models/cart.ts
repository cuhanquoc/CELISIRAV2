import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {asPath, mapImage, mapMoney, sanitizeText} from './shared';

export interface CartLineViewModel {
  id: string;
  quantity: number;
  title: string;
  variantTitle: string;
  productTitle: string;
  productHandle: string;
  productHref: string;
  image: ReturnType<typeof mapImage>;
  unitPrice: ReturnType<typeof mapMoney>;
  compareAtUnitPrice: ReturnType<typeof mapMoney>;
  linePrice: ReturnType<typeof mapMoney>;
}

export interface CartSummaryViewModel {
  cartId: string;
  totalQuantity: number;
  checkoutUrl: string | null;
  subtotal: ReturnType<typeof mapMoney>;
  total: ReturnType<typeof mapMoney>;
  discounts: Array<{code: string; applicable: boolean}>;
  lines: CartLineViewModel[];
}

function mapLine(
  line: CartApiQueryFragment['lines']['nodes'][number],
): CartLineViewModel | null {
  const merchandise = line.merchandise;
  if (!merchandise) return null;

  const productTitle = sanitizeText(merchandise.product.title);
  const variantTitle = sanitizeText(merchandise.title);

  return {
    id: line.id,
    quantity: line.quantity,
    title: variantTitle && variantTitle !== 'Default Title'
      ? `${productTitle} - ${variantTitle}`
      : productTitle,
    variantTitle,
    productTitle,
    productHandle: merchandise.product.handle,
    productHref: asPath(`products/${merchandise.product.handle}`),
    image: mapImage(
      merchandise.image,
      `${productTitle} ${variantTitle}`.trim(),
    ),
    unitPrice: mapMoney(line.cost.amountPerQuantity),
    compareAtUnitPrice: mapMoney(line.cost.compareAtAmountPerQuantity),
    linePrice: mapMoney(line.cost.totalAmount),
  };
}

export function mapCartToViewModel(
  cart: CartApiQueryFragment | null | undefined,
): CartSummaryViewModel | null {
  if (!cart) return null;

  return {
    cartId: cart.id,
    totalQuantity: cart.totalQuantity || 0,
    checkoutUrl: cart.checkoutUrl || null,
    subtotal: mapMoney(cart.cost.subtotalAmount),
    total: mapMoney(cart.cost.totalAmount),
    discounts: cart.discountCodes.map((discountCode) => ({
      code: discountCode.code,
      applicable: discountCode.applicable,
    })),
    lines: cart.lines.nodes.map(mapLine).filter(Boolean) as CartLineViewModel[],
  };
}

export function mapCelisiraCartQueryToViewModel(
  cart: CartApiQueryFragment | null | undefined,
): CartSummaryViewModel | null {
  return mapCartToViewModel(cart);
}
