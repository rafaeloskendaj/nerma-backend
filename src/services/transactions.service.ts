import { CustomRequest } from "../middlewares/admin.middleware";
import Aggregator_Transaction from "../models/Transaction_Plaid";

export const addUserTransaction = async (data) => {
    const existTx = await Aggregator_Transaction.findOne({ transaction_id: data.transaction_id });
    if (!existTx) {
        await Aggregator_Transaction.create(data);
    }
};

export async function getPlaidTransaction(req: CustomRequest, queryParams) {
    const { page, limit, sortOrder, sortBy } = queryParams;
    const query = {
        user: req.token._id,
    };

    //   if (search) {
    //     query.$or = [
    //       { name: new RegExp(search, 'i') },
    //       { merchant_name: new RegExp(search, 'i') },
    //       { category: new RegExp(search, 'i') },
    //     ];
    //   }

    const options = {
        page,
        limit,
        sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
        populate: {
            path: 'account',
        },
    };

    return await Aggregator_Transaction.paginate(query, options);
}