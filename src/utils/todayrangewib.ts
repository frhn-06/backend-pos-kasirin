const todayRangeWIB = () => {
    const now = new Date();

    const wib = new Date(now.getTime() + 7 * 60 * 60 * 1000);

    const year = wib.getUTCFullYear();
    const month = wib.getUTCMonth();
    const date = wib.getUTCDate();


    const start = new Date(Date.UTC(year, month, date, -7, 0, 0, 0));

    const end = new Date(Date.UTC(year, month, date, 16, 59, 59, 999));

    return {
        start,
        end
    }

}


export default todayRangeWIB;