import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import Department from '../../../models/Department';
import { isAuth, isAdmin } from '../../../utils/auth';

const handler = nextConnect({
  onError,
});

handler
  .use(isAuth, isAdmin)
  .get(async (req, res) => {
    await db.connect();
    const subcategories = await Department.aggregate([
      {
        $unwind: {
          path: '$categories',
        },
      },
      {
        $unwind: {
          path: '$categories.subcategories',
        },
      },
      { $match: { isDeleted:false } },
      {
        $project: {
          name: 1,
          category: '$categories.name',
          subcategory: '$categories.subcategories.name',
           
        },
      },
    ]);
    await db.disconnect();
    res.send(subcategories);


  })

  export default handler;