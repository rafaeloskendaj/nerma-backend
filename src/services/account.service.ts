import Account from '../models/Account.model';

export async function syncAccounts(data) {
    const account = await Account.findOneAndUpdate(
        { account_id: data.account_id },
        data,
        { upsert: true, new: true }
    );
    return account;
};

export async function getAccountByAccountId(account_id) {
    return await Account.findOne({ account_id })
};

export async function getAccountDetailsByUser(user) {
    return await Account.find({ user })
};