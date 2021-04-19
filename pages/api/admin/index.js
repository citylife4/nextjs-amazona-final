import nextConnect from "next-connect";
import { onError } from "../../../utils/error";
import db from "../../../utils/db";
import User from '../../../models/User';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import { isAuth, isAdmin } from '../../../utils/auth'


const handler = nextConnect({
    onError,
});

handler.use(isAuth, isAdmin)
    .get(async (req, res) => {
        await db.connect();

        const year = new Date().getFullYear();
        const fromCurrentYear = new Date(year, 0, 0, 0, 0, 0);
        const toCurrentYear = new Date(year + 1, 0, 0, 0, 0, 0);
        const fromPreviousYear = new Date(year - 1, 0, 0, 0, 0, 0);
        const toPreviousYear = new Date(year, 0, 0, 0, 0, 0);

        let salesReport = 0;
        let previousYearSalesReport = 0;

        salesReport = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: fromCurrentYear,
                        $lt: toCurrentYear,
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%m', date: '$createdAt' } },
                    totalSales: {
                        $sum: '$totalPrice',
                    },
                },
            },
        ]);
        previousYearSalesReport = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: fromPreviousYear,
                        $lt: toPreviousYear,
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%m', date: '$createdAt' } },
                    totalSales: {
                        $sum: '$totalPrice',
                    },
                },
            },
        ]);

        const months = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        salesReport.map((x) => {
            const month = Number(x._id);
            months[month - 1] = x.totalSales;
            return x;
        });
        const preMonths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        previousYearSalesReport.map((x) => {
            const month = Number(x._id);
            preMonths[month - 1] = x.totalSales;
            return x;
        });

        let saleTotal = 0;
        const salesView = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    sales: {
                        $sum: '$totalPrice',
                    },
                },
            },
        ]);
        saleTotal = salesView.length > 0 ? salesView[0].sales : 0;

        //cost profit
        const fixedCosts = 300;
        let costProfitData = 0;
        costProfitData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: {
                        $sum: '$totalPrice',
                    },
                    totalBuySales: {
                        $sum: '$totalBuyPrice',
                    },
                },
            },
        ]);

        //view products
        let viewProduct = 0;
        viewProduct = await Product.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: fromCurrentYear,
                        $lt: toCurrentYear,
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%m', date: '$createdAt' } },
                    productView: {
                        $sum: '$views',
                    },
                },
            },
        ]);

        const viewMonths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        viewProduct.map((x) => {
            const month = Number(x._id);
            viewMonths[month - 1] = x.productView;
            return x;
        });

        //view brands
        let viewBrand = '';
        viewBrand = await Product.aggregate([
            {
                $group: {
                    _id: '$brand',
                    brandView: {
                        $sum: '$views',
                    },
                },
            },
        ]);

        // brand limit
        const LIMIT_BRAND = 3;
        viewBrand.sort((a, b) => (a.brandView > b.brandView ? -1 : 1));
        const limitBrand =
            viewBrand.length > LIMIT_BRAND ? LIMIT_BRAND : viewBrand.length;
        const viewBrandShort = [];
        for (let i = 0; i < limitBrand; i += 1) {
            viewBrandShort.push(viewBrand[i]);
        }
        if (viewBrand.length > LIMIT_BRAND) {
            const otherBrandView = viewBrand
                .filter((item, index) => index > LIMIT_BRAND - 1)
                .reduce((a, c) => c.brandView + a, 0);

            viewBrandShort.push({
                _id: 'Others',
                brandView: otherBrandView,
            });
        }

        // view category

        let viewCategory = '';
        viewCategory = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    categoryView: {
                        $sum: '$views',
                    },
                },
            },
        ]);

        //category limit
        const LIMIT_CATEGORY = 3;
        viewCategory.sort((a, b) => (a.categoryView > b.categoryView ? -1 : 1));
        const limitCategory =
            viewCategory.length > LIMIT_CATEGORY
                ? LIMIT_CATEGORY
                : viewCategory.length;
        const viewCategoryShort = [];
        for (let i = 0; i < limitCategory; i += 1) {
            viewCategoryShort.push(viewCategory[i]);
        }
        if (viewCategory.length > LIMIT_CATEGORY) {
            const otherCategoryView = viewCategory
                .filter((item, index) => index > LIMIT_CATEGORY - 1)
                .reduce((a, c) => c.categoryView + a, 0);

            viewCategoryShort.push({
                _id: 'Others',
                categoryView: otherCategoryView,
            });
        }


        let productTotal = 0;
        productTotal = await Product.countDocuments();

        let orderTotal = 0;
        orderTotal = await Order.countDocuments();

        let userTotal = 0;
        userTotal = await User.countDocuments();

        await db.disconnect();

        res.send({
            viewCategory: viewCategoryShort,
            viewBrand: viewBrandShort,
            productTotal,
            orderTotal,
            userTotal,
            saleTotal,
            barChartData: {
                previousYear: preMonths,
                currentYear: months,
            },
            LineChartData: {
                currentYear: viewMonths,
            },
            costProfitData: {
                cost:
                    costProfitData.length > 0
                        ? costProfitData[0].totalBuySales + fixedCosts
                        : 0,
                profit: costProfitData.length > 0 ? costProfitData[0].totalSales : 0,
            },
        })
    })

export default handler;