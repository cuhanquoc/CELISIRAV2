import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/($locale).account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome back, ${customer.firstName}`
      : `Welcome back`
    : 'Your account';

  return (
    <section className="account-shell">
      <header className="account-shell-header">
        <p className="account-shell-kicker">Customer Area</p>
        <h1 className="account-shell-title">{heading}</h1>
      </header>
      <AccountMenu />
      <div className="account-shell-content">
        <Outlet context={{customer}} />
      </div>
    </section>
  );
}

function AccountMenu() {
  function isActiveStyle({
    isActive,
    isPending,
  }: {
    isActive: boolean;
    isPending: boolean;
  }) {
    return {
      fontWeight: isActive ? 'bold' : undefined,
      color: isPending ? 'grey' : 'black',
    };
  }

  return (
    <nav role="navigation" className="account-menu">
      <NavLink to="orders" end className="account-menu-link" style={isActiveStyle}>
        Orders
      </NavLink>
      <NavLink to="profile" className="account-menu-link" style={isActiveStyle}>
        Profile
      </NavLink>
      <NavLink to="addresses" className="account-menu-link" style={isActiveStyle}>
        Addresses
      </NavLink>
      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form className="account-logout" method="POST" action="/account/logout">
      <button type="submit" className="account-menu-link account-menu-link-muted">
        Sign out
      </button>
    </Form>
  );
}
