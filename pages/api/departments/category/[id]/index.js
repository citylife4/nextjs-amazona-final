import nextConnect from 'next-connect';
import { onError } from '../../../../../utils/error';
import db from '../../../../../utils/db';
import Department from '../../../../../models/Department';
import mongoose from 'mongoose';


const handler = nextConnect({
  onError,
});

handler
  .get(async (req, res) => {
    await db.connect();
    const categories = await Department.aggregate([
      {
        $match: { 'categories._id': mongoose.Types.ObjectId(req.query.id) },
      },
      {
        $project: {
          name: 1,
          category: '$categories',
          subcategory: '$categories.subcategories',
        },
      },
    ]);
    await db.disconnect();
    res.send(categories);

  })


  export default handler;