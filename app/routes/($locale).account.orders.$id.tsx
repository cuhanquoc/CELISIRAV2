import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/($locale).account.orders.$id';
import {Money, Image} from '@shopify/hydrogen';
import type {
  OrderLineItemFullFragment,
  OrderQuery,
} from 'customer-accountapi.generated';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  if (!params.id) {
    return redirect('/account/orders');
  }

  let orderId = params.id;
  try {
    orderId =
      typeof globalThis.atob === 'function'
        ? globalThis.atob(params.id)
        : decodeURIComponent(params.id);
  } catch {
    orderId = decodeURIComponent(params.id);
  }
  const {data, errors}: {data: OrderQuery; errors?: Array<{message: string}>} =
    await customerAccount.query(CUSTOMER_ORDER_QUERY, {
      variables: {
        orderId,
        language: customerAccount.i18n.language,
      },
    });

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const {order} = data;

  // Extract line items directly from nodes array
  const lineItems = order.lineItems.nodes;

  // Extract discount applications directly from nodes array
  const discountApplications = order.discountApplications.nodes;

  // Get fulfillment status from first fulfillment node
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? 'N/A';

  // Get first discount value with proper type checking
  const firstDiscount = discountApplications[0]?.value;

  // Type guard for MoneyV2 discount
  const discountValue =
    firstDiscount?.__typename === 'MoneyV2'
      ? (firstDiscount as Extract<
          typeof firstDiscount,
          {__typename: 'MoneyV2'}
        >)
      : null;

  // Type guard for percentage discount
  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue'
      ? (
          firstDiscount as Extract<
            typeof firstDiscount,
            {__typename: 'PricingPercentageValue'}
          >
        ).percentage
      : null;

  return {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  };
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();
  return (
    <section className="account-order">
      <div className="account-card-head">
        <h2>Order {order.name}</h2>
        <p>Placed on {new Date(order.processedAt!).toLocaleDateString()}</p>
      </div>
      {order.confirmationNumber && (
        <p className="account-order-confirmation">
          Confirmation: {order.confirmationNumber}
        </p>
      )}
      <div className="account-order-grid">
        <table className="account-order-table">
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((lineItem, lineItemIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <OrderLineRow key={lineItemIndex} lineItem={lineItem} />
            ))}
          </tbody>
          <tfoot>
            {((discountValue && discountValue.amount) ||
              discountPercentage) && (
              <tr>
                <th scope="row" colSpan={3}>
                  Discounts
                </th>
                <td>
                  {discountPercentage ? (
                    <span>-{discountPercentage}% OFF</span>
                  ) : (
                    discountValue && <Money data={discountValue!} />
                  )}
                </td>
              </tr>
            )}
            <tr>
              <th scope="row" colSpan={3}>
                Subtotal
              </th>
              <td>
                <Money data={order.subtotal!} />
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                Tax
              </th>
              <td>
                <Money data={order.totalTax!} />
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                Total
              </th>
              <td>
                <Money data={order.totalPrice!} />
              </td>
            </tr>
          </tfoot>
        </table>
        <aside className="account-card account-order-aside">
          <h3>Shipping Address</h3>
          {order?.shippingAddress ? (
            <address>
              <p>{order.shippingAddress.name}</p>
              {order.shippingAddress.formatted ? (
                <p>{order.shippingAddress.formatted}</p>
              ) : (
                ''
              )}
              {order.shippingAddress.formattedArea ? (
                <p>{order.shippingAddress.formattedArea}</p>
              ) : (
                ''
              )}
            </address>
          ) : (
            <p>No shipping address defined</p>
          )}
          <h3>Status</h3>
          <div>
            <p>{fulfillmentStatus}</p>
          </div>
        </aside>
      </div>
      <p className="account-order-status-link">
        <a target="_blank" href={order.statusPageUrl} rel="noreferrer">
          View order status →
        </a>
      </p>
    </section>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  const lineItemPrice = lineItem.price ?? lineItem.totalDiscount;
  const lineTotal = Number(lineItemPrice?.amount ?? 0) * lineItem.quantity;

  return (
    <tr>
      <td>
        <div className="account-line-item">
          {lineItem?.image && (
            <div className="account-line-item-image">
              <Image data={lineItem.image} width={96} height={96} />
            </div>
          )}
          <div>
            <p className="account-line-item-title">{lineItem.title}</p>
            <small>{lineItem.variantTitle}</small>
          </div>
        </div>
      </td>
      <td>
        {lineItemPrice ? (
          <Money data={lineItemPrice} />
        ) : (
          <span aria-label="Unavailable price">-</span>
        )}
      </td>
      <td>{lineItem.quantity}</td>
      <td>
        {lineItemPrice ? (
          <Money
            data={{
              amount: lineTotal.toFixed(2),
              currencyCode: lineItemPrice.currencyCode,
            }}
          />
        ) : (
          <span aria-label="Unavailable total">-</span>
        )}
      </td>
    </tr>
  );
}
