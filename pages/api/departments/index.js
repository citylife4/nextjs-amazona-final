import nextConnect from 'next-connect';
import { onError } from '../../../utils/error';
import db from '../../../utils/db';
import Department from '../../../models/Department';
import { isAuth, isAdmin } from '../../../utils/auth';

const handler = nextConnect({
  onError,
});

handler
  .get(async (req, res) => {
    await db.connect();
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
    const departments = await Department.find({ isDeleted: false,...searchFilter });
    await db.disconnect();
    res.send(departments);
  })

  .use(isAuth, isAdmin)
  .post(async (req, res) => {
    await db.connect();
    for (const department of req.body.departments) {
      if (department.isAdded) {
        const newDepartment = new Department({
          name: department.name,
          order: department.order,
          categories: department.categories,
          subcategories: department.subcategories,
        });
        await newDepartment.save();
      }
      if (department.isEdited) {
        const editDepartment = await Department.findById(department._id);
        editDepartment.name = department.name;
        editDepartment.order = department.order;
        for (const category of department.categories) {
          if (category.isAdded) {
            editDepartment.categories.push({
              name: category.name,
              order: category.order,
              subcategories: category.subcategories,
            });
          }
          if (category.isEdited) {
            const editCategory = editDepartment.categories.find(
              (x) => x._id == category._id
            );
            editCategory.name = category.name;
            editCategory.order = category.order;

            // for for subcats
          }
          if (category.isDeleted) {
            editDepartment.categories.find(
              (x) => x._id == category._id
            ).isDeleted = true;
            
          }
         
         for (const subcategory of category.subcategories) {
             if (subcategory.isAdded) {
             editDepartment.categories.find(
              (x) => x._id == category._id
            ).subcategories.push({
              name: subcategory.name,
              order: subcategory.order,
            });
             }
          if (subcategory.isEdited) {
           const editSubCategory = editDepartment.categories.find(
              (x) => x._id == category._id
            ).subcategories.find(
              (x) => x._id == subcategory._id
            );
            editSubCategory.name = subcategory.name;
            editSubCategory.order = subcategory.order;   
          } 
          
            if (subcategory.isDeleted) {
           editDepartment.categories.find(
              (x) => x._id == category._id
            ).subcategories.find(
              (x) => x._id == subcategory._id
            ).isDeleted = true;
            
          } 
          
         }  
          
        }   

        await editDepartment.save();
      }
      if (department.isDeleted) {
        const deleteDepartment = await Department.findById(department._id);
        deleteDepartment.isDeleted = true;
        await deleteDepartment.save();
      }
    }
    const updatedDepartments = await Department.find({ isDeleted: false });
    res.send(updatedDepartments);
   
    await db.disconnect();
  });

export default handler;