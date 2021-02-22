import authService from '../components/api-authorization/AuthorizeService';
import {restManager} from './restManager';

const generateOptions = (token, data = null, overrides = null) => {
    const options = {
        redirect: 'follow',
    };

    if (token) {
        Object.assign(options, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }

    if (data) {
        Object.assign(options, {
            headers: {
                ...options.headers,
            },
            body: (data instanceof FormData) ? data : JSON.stringify(data),
        });
    }

    if (overrides) {
        Object.assign(options, overrides);
    }

    return options;
};

/**
 * @param {function({endpoint: string, data: Object, overrides: Object, token: string}): Promise<Response>} request
 * @returns {function(Function): function(string, Object=, Object=): Promise<*>}
 */
const fromRequest = (request) =>
    /**
     * @param {Function} Type Constructor function (class)
     * @returns {function(string, Object=, Object=): Promise<*>}
     */
    // eslint-disable-next-line implicit-arrow-linebreak
    (Type) =>
    /**
     * @param {string} endpoint
     * @param {object} data
     * @param {object} overrides
     * @returns {Promise<*>}
     */
    // eslint-disable-next-line implicit-arrow-linebreak
        async (endpoint, data = null, overrides = null) => {
            const token = await authService.getAccessToken();
            const originalResponse = await request({
                endpoint,
                data,
                overrides,
                token,
            });

            try {
                const response = originalResponse.clone();

                // TODO: Check if Type extends Mergeable
                if (!Type) {
                    return response?.json();
                }

                const result = await response?.json();
                if (!(Type instanceof Array)) {
                    return new Type(result);
                }

                if (result instanceof Array) {
                    return result.map((x) => new Type[0](x));
                }

                return result;
            } catch (err) {
                return originalResponse;
            }
        };

export const getAsync = fromRequest(
    (_) => fetch(_.endpoint, generateOptions(_.token, _.data, {
        method: 'GET',
        ..._.overrides,
    })),
);

export const postAsync = fromRequest(
    (_) => fetch(_.endpoint, generateOptions(_.token, _.data,
        {
            method: 'POST',
            ..._.overrides,
        })),
);

export const deleteAsync = fromRequest(
    (_) => fetch(_.endpoint, generateOptions(_.token, _.data, {
        method: 'DELETE',
        ..._.overrides,
    })),
);

export default {
    getAsync,
    postAsync,
    deleteAsync,
};
