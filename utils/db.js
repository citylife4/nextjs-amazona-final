/* eslint-disable no-undef */
import mongoose from 'mongoose';

const connection = {};

async function connect() {
  if (connection.isConnected) {
    console.log('already connected');
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnected = mongoose.connections[0].readyState;
    if (connection.isConnected === 1) {
      console.log('use previous connection');
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  console.log('new connection');
  connection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
  if (connection.isConnected) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnected = false;
    } else {
      console.log('not disconnected');
    }
  }
}

const convertDocToObj = (doc) => {
  doc._id = doc._id.toString();
  if (doc.user) doc.user = doc.user.toString();
  if (doc.seller) doc.seller = doc.seller.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  if (doc.reviews) {
    doc.reviews = doc.reviews.map(convertDocToObj);
  }
  if (doc.transactions) {
    doc.transactions = doc.transactions.map(convertDocToObj);
  }
  return doc;
};

export default { connect, disconnect, convertDocToObj };
