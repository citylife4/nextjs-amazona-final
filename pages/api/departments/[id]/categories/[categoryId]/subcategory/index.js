import nextConnect from 'next-connect';
import { onError } from '../../../../../../../utils/error';
import db from '../../../../../../../utils/db';
import Department from '../../../../../../../models/Department';
import { isAdmin, isAuth } from '../../../../../../../utils/auth';

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
    
        const category = department.categories.find(
          (x) => x._id == req.params.categoryId
          )
       if(category){
          category.subcategories.push(req.body);
          const updatedCategory = await category.save();
        
          const addedSubCategory =
           updatedCategory.subcategories[updatedCategory.subcategories.length - 1];
          
          
             res.status(201).send(addedSubCategory);
       }else {
        
         res.status(404).send({ message: 'No category is found' });
       }
        
       await department.save();
       await db.disconnect();
        }else {
          await db.disconnect();
         res.status(404).send({ message: 'No department found' });
       }

    })

    export default handler;