const printDateOnGet = (req, res, next) => {
    if (req.method === 'GET') {
        console.log('Request date:', req.currentDate);
    }
    next();
};

module.exports = printDateOnGet;