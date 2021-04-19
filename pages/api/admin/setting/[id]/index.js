import nextConnect from 'next-connect';
import { onError } from '../../../../../utils/error';
import db from '../../../../../utils/db';
import Setting from '../../../../../models/Setting';
import { isAuth, isAdmin} from '../../../../../utils/auth';

const handler = nextConnect({
  onError,
});

handler
  .use(isAuth, isAdmin)
  .get(async (req, res) => {
    await db.connect();
    const setting = await Setting.findById({ _id: req.query.id });
    await db.disconnect();
    res.send(setting);
  })

  .use(isAuth, isAdmin)
  .put(async (req, res) => {
    await db.connect();
    const setting = await Setting.findById({ _id: req.query.id });
    if (setting) {
      setting.siteName = req.body.siteName;
      setting.pageSize = req.body.pageSize;
      setting.siteLogo = req.body.siteLogo;
      setting.isActive = req.body.isActive;
      setting.theme = req.body.theme;
      const updatedSetting = await setting.save();
       await db.disconnect();
      res.send({
        message: 'Setting Updated By Admin',
        data: updatedSetting,
      });
    } else {
      await db.disconnect();
      throw Error('Setting does not exist.');
    }

  })

  .use(isAuth, isAdmin)
  .delete(async (req, res) => {
    await db.connect();
    const setting = await Setting.findOne({ _id: req.query.id });
    if (setting) {
      const deletedSetting = await setting.remove();
      await db.disconnect();
      res.send(deletedSetting);
    } else {
      await db.disconnect();
      res.status(404).send('Setting Not Found.');
    }

  })


  export default handler;