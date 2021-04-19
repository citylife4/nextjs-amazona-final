import nextConnect from 'next-connect';
import { onError } from '../../../../../../utils/error';
import db from '../../../../../../utils/db';
import Department from '../../../../../../models/Department';
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
      const categories = department.categories.find(
        (x) => x._id == req.query.categoryId
      );
      await db.disconnect();
      res.send(categories)
      }
})
    .use(isAuth, isAdmin)
    .delete(async (req, res) => {
      await db.connect();
      const department = await Department.findById(req.query.id);
      if (department) {
        department.categories = department.categories.filter(
          (x) => x._id != req.query.categoryId
        );
        await department.save();

        await db.disconnect();
        res.send({ message: 'Deleted successfully' });
      } else {
        await db.disconnect();
        res.status(404).send({ message: 'Not department found' });
      }

    })

    export default handler;