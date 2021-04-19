import nextConnect from 'next-connect';
import { onError } from '../../../../../../utils/error';
import Department from '../../../../../../models/Department';
import db from '../../../../../../utils/db';
import { isAdmin, isAuth } from '../../../../../../utils/auth';

const handler = nextConnect({
    onError,
});

handler
.use(isAuth, isAdmin)
.get(async (req, res) => {
  await db.connect();
      const department = await Department.findById(req.query.id);
      if (department) {
      const subCategory = department.categories.map(
        (x) => x.subcategories.find(
          (s) => s._id == req.query.subCategoryId
        )
      );

      await db.disconnect();
      res.send(subCategory)
      }
})
   
    export default handler;