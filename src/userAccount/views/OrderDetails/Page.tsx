import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { TaxedMoney } from "@components/containers";
import { checkoutMessages } from "@temp/intl";
import {
  OrderDetail,
  OrderDetail_lines,
} from "@saleor/sdk/lib/fragments/gqlTypes/OrderDetail";

import { AddressSummary, CartTable, NotFound } from "../../../components";
import { ILine } from "../../../components/CartTable/ProductRow";

import { orderHistoryUrl } from "../../../app/routes";

const extractOrderLines = (lines: OrderDetail_lines[]): ILine[] => {
  return lines
    .map(line => ({
      quantity: line.quantity,
      totalPrice: {
        ...line.unitPrice,
        currency: line.unitPrice.currency,
        gross: {
          amount: line.quantity * line.unitPrice.gross.amount,
          ...line.unitPrice.gross,
        },
        net: {
          amount: line.quantity * line.unitPrice.net.amount,
          ...line.unitPrice.net,
        },
      },
      ...line.variant,
      name: line.productName,
    }))
    .sort((a, b) => b.id.toLowerCase().localeCompare(a.id.toLowerCase()));
};

const Page: React.FC<{
  guest: boolean;
  order: OrderDetail;
}> = ({ guest, order }) =>
  order ? (
    <>
      {!guest && (
        <Link className="order-details__link" to={orderHistoryUrl}>
          <FormattedMessage defaultMessage="Go back to Order History" />
        </Link>
      )}
      <h3>
        <FormattedMessage
          defaultMessage="Your order nr: {orderNum}"
          values={{ orderNum: order.number }}
        />
      </h3>
      <p className="order-details__status">
        {order.paymentStatusDisplay} / {order.statusDisplay}
      </p>
      <CartTable
        lines={extractOrderLines(order.lines)}
        totalCost={<TaxedMoney taxedMoney={order.total} />}
        deliveryCost={<TaxedMoney taxedMoney={order.shippingPrice} />}
        subtotal={<TaxedMoney taxedMoney={order.subtotal} />}
      />
      <div className="order-details__summary">
        <div>
          <h4>
            <FormattedMessage {...checkoutMessages.shippingAddress} />
          </h4>
          <AddressSummary
            address={order.shippingAddress}
            email={order.userEmail}
            paragraphRef={this.shippingAddressRef}
          />
        </div>
      </div>
    </>
  ) : (
    <NotFound />
  );

export default Page;
