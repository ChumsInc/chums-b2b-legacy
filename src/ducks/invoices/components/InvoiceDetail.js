import React, {useState} from 'react';
import AddToCartModal from "../../../components/AddToCartModal";
import OrderDetailLine from "../../../components/OrderDetailLine";
import OrderFooter from "../../../components/OrderFooter";
import {useSelector} from "react-redux";
import {noop} from "../../../utils/general";
import {ORDER_TYPE} from "../../../constants/orders";
import {selectCurrentInvoice} from "../selectors";
import InvoiceDetailLine from "./InvoiceDetailLine";

const InvoiceDetail = () => {
    const invoice = useSelector(selectCurrentInvoice);
    const [addToCart, setAddToCart] = useState(null);

    if (!invoice) {
        return null
    }

    const {} = invoice;

    return (
        <>
            <div className="table-responsive">
                <table className="table table-sm table-sticky">
                    <thead>
                    <tr className="order-detail">
                        <th>&nbsp;</th>
                        <th>Item</th>
                        <th>Description</th>
                        <th>U/M</th>
                        <th className="text-end">Ordered</th>
                        <th className="text-end">Unit Price</th>
                        <th className="text-end hidden-xs">MSRP</th>
                        <th className="text-end hidden-xs">Item Price</th>
                        <th className="text-end">Ext Price</th>
                        <th className="text-end">Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {[...invoice.Detail]
                        .sort((a, b) => Number(a.DetailSeqNo) - Number(b.DetailSeqNo))
                        .map(line => (
                            <InvoiceDetailLine key={line.DetailSeqNo} line={line}
                                             onAddToCart={() => setAddToCart(line)}/>
                        ))
                    }
                    </tbody>
                    <tfoot>
                    <OrderFooter renderForDetail={true}
                                 DiscountAmt={invoice.DiscountAmt ?? 0} DepositAmt={invoice.DepositAmt ?? 0}
                                 FreightAmt={invoice.FreightAmt ?? 0} ShipVia={invoice.ShipVia ?? ''}
                                 NonTaxableAmt={invoice.NonTaxableSalesAmt ?? 0}
                                 TaxableAmt={invoice.TaxableSalesAmt ?? 0}
                                 SalesTaxAmt={invoice.SalesTaxAmt ?? 0} TaxSchedule={invoice.TaxSchedule ?? ''}
                                 orderType={ORDER_TYPE.invoices}
                    />
                    </tfoot>
                </table>
            </div>

            {!!addToCart && (
                <AddToCartModal onClose={() => setAddToCart(null)}
                                itemCode={addToCart.ItemCode}
                                quantity={addToCart.QuantityOrdered}
                                comment={addToCart.CommentText}/>
            )}
        </>
    )
}

export default InvoiceDetail;
const mapStateToProps = ({cart, salesOrder, invoices}) => {
    const {cartProgress, cartName} = cart;
    const {
        SalesTaxAmt,
        TaxSchedule,
        TaxableSalesAmt,
        NonTaxableSalesAmt,
        DiscountAmt,
        Detail,
        ShipVia
    } = invoices.invoice;
    return {
        Detail,
        SalesTaxAmt,
        TaxSchedule,
        TaxableSalesAmt,
        NonTaxableSalesAmt,
        DiscountAmt,
        ShipVia,
        cartName,
    };
};
