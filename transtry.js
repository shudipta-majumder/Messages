const mongoose = require('mongoose');
require('dotenv').config();
const Account = require('./models/account');
const MongoUrl = process.env.MONGO_URL;

mongoose
  .connect(MongoUrl)
  .then(() => {
    console.log('mongodb atlas is connected');
  })
  .catch((error) => {
    console.error('Connection error:', error);
    process.exit(1);
  });

// Transfer function
async function transferFundsById(senderId, receiverId, amount) {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const sender = await Account.findOne({ accountNumber: senderId }).session(session);
    if (!sender) {
      throw new Error('Sender account not found');
    }
    if (sender.balance < amount) {
      throw new Error('Insufficient funds');
    }
    sender.balance -= amount;
    await sender.save();

    const receiver = await Account.findOne({ accountNumber: receiverId }).session(session);
    if (!receiver) {
      throw new Error('Receiver account not found');
    }
    receiver.balance += amount;
    await receiver.save();

    await session.commitTransaction();
    console.log('Transaction completed successfully');
  } catch (error) {
    await session.abortTransaction();
    console.error('Transaction failed and rolled back:', error.message);
  } finally {
    session.endSession();
  }
}

// Example function to call transferFundsById
const transferFunds = async (req, res) => {
  transferFundsById('123456789', '987654321', 900)
    .then(() => console.log('Done'))
    .catch((error) => console.error('Error in transfer:', error));
};

transferFunds();