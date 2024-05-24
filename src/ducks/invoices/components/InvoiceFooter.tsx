import {TableCell, TableRow} from "@mui/material";
import {useSelector} from "react-redux";
import {selectCurrentInvoice} from "../selectors";
import Decimal from "decimal.js";
import numeral from "numeral";


const InvoiceFooterRow = ({title, value}: {
    title: string;
    value?: string | null;
}) => {
    return (
        <TableRow>
            <TableCell component="th" scope="row" colSpan={6} align="right">{title}</TableCell>
            <TableCell align="right" colSpan={2}>{value}</TableCell>
            <TableCell/>
        </TableRow>

    )
}
const InvoiceFooter = () => {
    const invoice = useSelector(selectCurrentInvoice);
    if (!invoice) {
        return null;
    }
    const subTotal = new Decimal(invoice.NonTaxableSalesAmt).add(invoice.TaxableSalesAmt);
    const salesTax = new Decimal(invoice.SalesTaxAmt);
    const freight = new Decimal(invoice.FreightAmt);
    const discountAmt = new Decimal(invoice.DiscountAmt);
    const total = subTotal.add(salesTax).add(freight).sub(discountAmt);

    return (
        <>
            <InvoiceFooterRow title="Sub Total" value={numeral(subTotal).format('$ 0,0.00')}/>
            <InvoiceFooterRow title={`Sales Tax ${salesTax.eq(0) ? '' : invoice.TaxSchedule}`}
                              value={numeral(salesTax).format('$ 0,0.00')}/>
            <InvoiceFooterRow title="Freight" value={numeral(freight).format('$ 0,0.00')}/>
            {!discountAmt.eq(0) && <InvoiceFooterRow title="Discount" value={numeral(discountAmt).format('$ 0,0.00')}/>}
            <InvoiceFooterRow title="Total" value={numeral(total).format('$ 0,0.00')}/>
        </>
    )
}

export default InvoiceFooter;
