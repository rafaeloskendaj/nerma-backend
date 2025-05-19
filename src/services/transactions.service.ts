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

    const options = {
        page,
        limit,
        sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
        populate: {
            path: 'account',
        },
    };

    return Aggregator_Transaction.paginate(query, options);
}