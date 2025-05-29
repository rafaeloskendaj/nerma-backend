import { ItemPublicTokenExchangeRequest, Products } from 'plaid';
import PlaidClient from '../utils/plaidClient';
import Plaid from '../models/UserAggregator.model';
import { CustomRequest } from '../middlewares/admin.middleware';
import { logger } from '../startup/logger';
import createHttpError from 'http-errors';
import moment from 'moment';
import { addUserTransaction } from './transactions.service';
import { getUsersByTier, updateIsPlaidFlag } from './user.service';
import { getAccountByAccountId, syncAccounts } from './account.service';

const { PLAID_REDIRECT_URI, PLAID_ANDROID_PACKAGE_NAME } = process.env;

// PLAID_PRODUCTS is a comma-separated list of products to use when initializing
// Link. Note that this list must contain 'assets' in order for the app to be
// able to create and retrieve asset reports.
const PLAID_PRODUCTS = (process.env.PLAID_PRODUCTS || Products.Transactions).split(
    ',',
);

// PLAID_COUNTRY_CODES is a comma-separated list of countries for which users
// will be able to select institutions from.
const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || 'US').split(
    ',',
);

export async function getPlaidUserAccessToken(user: unknown) {
    return await Plaid.findOne({ user })
};

export async function exchangePublicToken(req: CustomRequest) {
    try {
        const request: ItemPublicTokenExchangeRequest = {
            public_token: req.body.public_token,
        };
        const response = await PlaidClient.itemPublicTokenExchange(request);

        await Plaid.create({
            user: req.token._id,
            accessToken: response.data.access_token,
            itemId: response.data.item_id,
            publicToken: req.body.public_token,
            aggregator: 'PLAID'
        });

        await getAccount(response.data.access_token, req.token._id);
        // await getTheLastWeekTransaction(response.data.access_token, req.token._id);
        await updateIsPlaidFlag(req.token._id);

        return {
            message: "Token exchange successfully"
        }

    } catch (error) {
        logger.error(error);
        throw new createHttpError.BadRequest("Invalid Public Token");
    }
};

export async function syncPlaidTransactionsForTier(tier: string) {
    const users = await getUsersByTier(tier);
    const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
    const endDate = moment().format('YYYY-MM-DD');

    for (const user of users) {
        try {
            const userAccessToken = await getPlaidUserAccessToken(user._id);
            const response = await PlaidClient.transactionsGet({
                access_token: userAccessToken.accessToken,
                start_date: startDate,
                end_date: endDate,
            });

            const { accounts, transactions } = response.data;

            for (const acct of accounts) {
                const updatedAccount = {
                    ...acct,
                    user,
                    aggregator: 'PLAID',
                };
                await syncAccounts(updatedAccount);
            }

            for (const txn of transactions) {
                const accountObj = await getAccountByAccountId(txn.account_id);
                if (txn.amount > 0) {
                    const updatedTransaction = {
                        ...txn,
                        user,
                        aggregator: 'PLAID',
                        account: accountObj?._id,
                    };
                    await addUserTransaction(updatedTransaction);
                }
            }
        } catch (err) {
            console.error(`Error syncing data for user ${user._id} (Tier: ${tier})`, err);
        }
    }
}

export async function createLinkToken(req: CustomRequest) {
    const clientUserId = req.token?._id;
    const USER_TOKEN = null;

    const configs: any = {
        user: {
            client_user_id: clientUserId,
        },
        client_name: 'Plaid Quickstart',
        products: PLAID_PRODUCTS,
        country_codes: PLAID_COUNTRY_CODES,
        language: 'en',
    };

    if (PLAID_REDIRECT_URI !== '') {
        configs.redirect_uri = PLAID_REDIRECT_URI;
    }

    if (PLAID_ANDROID_PACKAGE_NAME !== '') {
        configs.android_package_name = PLAID_ANDROID_PACKAGE_NAME;
    }

    if (PLAID_PRODUCTS.includes(Products.Statements)) {
        configs.statements = {
            end_date: moment().format('YYYY-MM-DD'),
            start_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
        };
    }

    if (PLAID_PRODUCTS.some(product => product.startsWith('cra_'))) {
        if (!USER_TOKEN) throw new Error('Missing USER_TOKEN for CRA products');

        console.log(configs, 'configs');

        configs.user_token = USER_TOKEN;
        configs.cra_options = {
            days_requested: 60,
        };
        configs.consumer_report_permissible_purpose = 'ACCOUNT_REVIEW_CREDIT';
    }

    const createTokenResponse = await PlaidClient.linkTokenCreate(configs);
    return createTokenResponse.data;
};

export async function getAccount(access_token: string, user: unknown) {
    const response = await PlaidClient.accountsGet({
        access_token,
    });

    const { accounts } = response.data;

    for (const acct of accounts) {
        const updatedAccount = {
            ...acct,
            user,
            aggregator: 'PLAID',
        };
        await syncAccounts(updatedAccount);
    }
};
