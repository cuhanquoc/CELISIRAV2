import type {
  CustomerDetailsQuery,
  CustomerOrdersQuery,
} from 'customer-accountapi.generated';
import {compactStrings, sanitizeText} from './shared';

export interface AccountIdentityViewModel {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  displayName: string;
  email: string;
  phone: string;
  hasOrders: boolean;
  defaultAddressLines: string[];
}

function buildFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

function mapAddressLines(
  customer: NonNullable<CustomerDetailsQuery['customer']>,
): string[] {
  const defaultAddress = customer.defaultAddress;
  if (!defaultAddress) return [];

  return compactStrings(defaultAddress.formatted);
}

export function mapAccountShellViewModel(input: {
  details: CustomerDetailsQuery;
  orders?: CustomerOrdersQuery | null;
}): AccountIdentityViewModel | null {
  const customer = input.details.customer;
  if (!customer) return null;

  const accountCustomer = customer as typeof customer & {
    displayName?: string | null;
    emailAddress?: {
      emailAddress?: string | null;
    } | null;
    phoneNumber?: {
      phoneNumber?: string | null;
    } | null;
  };

  const firstName = sanitizeText(customer.firstName);
  const lastName = sanitizeText(customer.lastName);
  const displayName = sanitizeText(accountCustomer.displayName);
  const fullName = buildFullName(firstName, lastName) || displayName;

  return {
    id: customer.id,
    firstName,
    lastName,
    fullName,
    displayName: displayName || fullName,
    email: sanitizeText(accountCustomer.emailAddress?.emailAddress),
    phone: sanitizeText(accountCustomer.phoneNumber?.phoneNumber),
    hasOrders: Boolean(input.orders?.customer?.orders.nodes.length),
    defaultAddressLines: mapAddressLines(customer),
  };
}

interface CelisiraAccountShellQueryLike {
  customer: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
    emailAddress?: {
      emailAddress?: string | null;
    } | null;
    phoneNumber?: {
      phoneNumber?: string | null;
    } | null;
    defaultAddress?:
      | {
          formatted?: Array<string | null> | null;
        }
      | null;
    orders?: {
      nodes?: Array<{id: string}> | null;
      pageInfo?: {
        hasNextPage?: boolean | null;
      } | null;
    } | null;
  } | null;
}

export function mapCelisiraAccountShellQueryToViewModel(
  input: CelisiraAccountShellQueryLike,
): AccountIdentityViewModel | null {
  const customer = input.customer;
  if (!customer) return null;

  const firstName = sanitizeText(customer.firstName);
  const lastName = sanitizeText(customer.lastName);
  const displayName = sanitizeText(customer.displayName);
  const fullName = buildFullName(firstName, lastName) || displayName;

  return {
    id: customer.id,
    firstName,
    lastName,
    fullName,
    displayName: displayName || fullName,
    email: sanitizeText(customer.emailAddress?.emailAddress),
    phone: sanitizeText(customer.phoneNumber?.phoneNumber),
    hasOrders: Boolean(
      customer.orders?.nodes?.length || customer.orders?.pageInfo?.hasNextPage,
    ),
    defaultAddressLines: compactStrings(customer.defaultAddress?.formatted),
  };
}
