import Datauri from 'datauri/parser';
import path from 'path';

const dUri = new Datauri();

const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer)

export default dataUri;