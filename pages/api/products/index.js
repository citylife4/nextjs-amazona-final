import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
//import data from '../../../utils/data';
import Product from '../../../models/Product';
import City from '../../../models/City';
import { isAuth, isAdmin } from '../../../utils/auth';
import { PAGE_SIZE } from '../../../utils/config';
import slugify from 'slugify';

const handler = nextConnect({
    onError,
});

handler
    .get(async (req, res) => {
        await db.connect();
        const pageSize = req.query.pageSize || PAGE_SIZE;
        const page = req.query.page || 1;
        const cities = await City.find();
        const searchQuery = req.query.query || 'all';
        const searchFilter =
            searchQuery !== 'all'
                ? {
                    name: {
                        $regex: searchQuery,
                        $options: 'i',
                    },
                }
                : {};

        const productDocs = await Product.find({
            ...searchFilter,

        })
            .skip(pageSize * (page - 1))
            .limit(pageSize)
            .lean();

        const countProducts = await Product.countDocuments({
            ...searchFilter,

        });
        await db.disconnect();

        const products = productDocs.map(db.convertDocToObj);
        // const products = JSON.parse(JSON.stringify(productDocs))

        res.send({
            products,
            cities,
            page,
            pages: Math.ceil(countProducts / pageSize),
        });
    })
    .use(isAuth, isAdmin)
    .post(async (req, res) => {
        await db.connect();
        const product = new Product({
            name: 'sample name ',
            slug: slugify('sample name', { lower: true }),
            image:
                'https://res.cloudinary.com/da5nme1vl/image/upload/v1612158742/shirt2_yukdej.jpg',
            price: 0,
            buyPrice: 0,
            oldPrice: 0,
            department: 'Sample Department',
            category: 'sample Category',
            subcategory: 'sample Category',
            brand: 'sample brand',
            countInStock: 0,
            rating: 0,
            cities: [],
            numReviews: 0,
            description: 'sample description',
            discount: 0,
            featured: false,
            seller: req.user._id,
        });
        const createdProduct = await product.save();
        await db.disconnect();
        res.send({ message: 'Product created.', product: createdProduct });
    });

export default handler;
