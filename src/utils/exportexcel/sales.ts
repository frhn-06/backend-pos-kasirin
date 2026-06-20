import { IReportSales } from "../../types/reportsales";
import ExcelJS from "exceljs";

const exportExcelSales = (report: IReportSales) => {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Sales Report");

    worksheet.addRow(["Sales Report"]);

    worksheet.addRow([]);

    worksheet.addRow(["Total Sales", report.summary.totalSales]);
    worksheet.addRow(["Total Orders", report.summary.totalOrders]);
    worksheet.addRow(["Average Order Value", report.summary.averegeOrderValue]);


    worksheet.addRow([]);
    worksheet.addRow([]);


    worksheet.addRow(["Date", "Total Orders", "Total Sales"]);

    report.salesByDay.forEach((s) => {
        worksheet.addRow([s.date, s.totalOrders, s.totalSales]);
    })

    return workbook;
}


export default exportExcelSales