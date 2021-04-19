import nextConnect from 'next-connect';
import { onError } from '../../../../../utils/error';
import db from '../../../../../utils/db';
import Department from '../../../../../models/Department';
import { isAdmin, isAuth } from '../../../../../utils/auth';

const handler = nextConnect({
    onError,
});

handler
    .use(isAuth, isAdmin)
    .post(async (req, res) => {
      await db.connect();
      const { departmentId } = req.query;
      const department = await Department.findById(departmentId);
      if (department) {
        department.categories.push(req.body);
        const updatedDepartment = await department.save();
        const addedCategory =
          updatedDepartment.categories[updatedDepartment.categories.length - 1];
          await db.disconnect();  
        res.status(201).send(addedCategory);
      } else {
        await db.disconnect();
        res.status(404).send({ message: 'Department Not Found' });
      }

    })

    export default handler;