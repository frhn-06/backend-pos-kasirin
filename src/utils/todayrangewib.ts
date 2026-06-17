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


const rangeWIBUTC = {
    start: (query: string) => {
        const dateQuery = new Date(query);
        // console.log(dateQuery);

        const wib = new Date(dateQuery.getTime() + 7 * 60 * 60 * 1000);

        const year = wib.getUTCFullYear();
        const month = wib.getUTCMonth();
        const date = wib.getUTCDate();

        const angkaWaktu = Date.UTC(year, month, date, -7, 0, 0, 0)
        const result = new Date(angkaWaktu);

        return result
    },

    end: (query: string) => {
        const dateQuery = new Date(query);

        const wib = new Date(dateQuery.getTime() + 7 * 60 * 60 * 1000);

        const year = wib.getUTCFullYear();
        const month = wib.getUTCMonth();
        const date = wib.getUTCDate();

        const angkaWaktu = Date.UTC(year, month, date, 16, 59, 59, 999)
        const result = new Date(angkaWaktu);

        return result
    },
}


export {todayRangeWIB, rangeWIBUTC};