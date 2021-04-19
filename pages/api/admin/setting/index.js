import nextConnect from 'next-connect';
import { onError } from '../../../../utils/error';
import db from '../../../../utils/db';
import Setting from '../../../../models/Setting';
import { isAuth, isAdmin } from '../../../../utils/auth';

const handler = nextConnect({
  onError,
});

handler
  .use(isAuth, isAdmin)
  .get(async (req, res) => {
    await db.connect();
    const settings = await Setting.find();
    await db.disconnect();
    res.send(settings);
  })
  .use(isAuth, isAdmin)
  .post(async (req, res) => {
    await db.connect();
    const setting = new Setting({
      siteName: 'amazona',
      pageSize: '1',
      siteLogo: '/images/logo.png',
      theme: 'light',
    });

    const createdSetting = await setting.save();
    await db.disconnect();
    if (createdSetting) {
      res.status(201).send({
        setting: createdSetting,
        message: 'Setting Created Successfully',
      });
    } else {
      res.status(500).send({ message: 'Error in creating Setting' });
    }
  });

export default handler;
