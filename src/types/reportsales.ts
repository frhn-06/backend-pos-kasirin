interface ISummary {
    totalSales: number;
    totalOrders: number;
    averegeOrderValue: number;
}

interface ISalesByDay {
    date: string;
    totalSales: number;
    totalOrders: number;
}

interface IReportSales {
    summary : ISummary;
    salesByDay : ISalesByDay[];
}

export type {IReportSales}