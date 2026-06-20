import { IReportProduct } from "../../types/reportproduct";
import ExcelJS from 'exceljs'

const exportExcelProduct = (report: IReportProduct[]) => {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Product Report");

    worksheet.addRow(["Product Report"]);

    worksheet.addRow([])

    worksheet.addRow(["Name", "Qty Sold", "Total Pemasukan", "Jumlah Transaksi"]);

    report.forEach((p) => {
        worksheet.addRow([p.productName, p.qtySold, p.totalPemasukan, p.totalOrders]);
    })

    return workbook;
}

export default exportExcelProduct;