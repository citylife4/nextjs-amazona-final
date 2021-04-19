import nextConnect from 'next-connect';
import { onError } from '../../../../utils/error';
import db from '../../../../utils/db';
import Department from '../../../../models/Department';
import { isAdmin, isAuth } from '../../../../utils/auth';

const handler = nextConnect({
    onError,
});

handler
    .use(isAuth, isAdmin)
    .get(async (req, res) => {
      await db.connect();
     
      const department = await Department.findById({ _id: req.query.id });
      await db.disconnect();
       res.send(department);

    })

    export default handler;