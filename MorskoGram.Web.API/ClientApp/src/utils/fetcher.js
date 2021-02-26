import mimeType from 'mime-types';
import authService from '../components/api-authorization/AuthorizeService';

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
                ...(data instanceof FormData
                    ? {}
                    : {'Content-Type': mimeType.contentType('json')}),
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
 * @returns {function(Function|Function[]): function(string, Object=, Object=): Promise<*>}
 */
const fromRequest = (request) =>
    /**
     * @param {Function|Function[]} Type Constructor function (class)
     * @returns {function(string, Object=, Object=): Promise<*>}
     */
    // eslint-disable-next-line implicit-arrow-linebreak
    (Type = null) =>
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

            if (!/^2\d\d$/.test(originalResponse.status?.toString())) {
                throw originalResponse;
            }

            try {
                const response = await originalResponse.clone();

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
                throw originalResponse;
            }
        };

export const getAsync = fromRequest(
    (_) => fetch(_.endpoint, generateOptions(_.token, null, {
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

export const patchAsync = fromRequest(
    (_) => fetch(_.endpoint, generateOptions(_.token, _.data, {
        method: 'PATCH',
        ..._.overrides,
    })),
);
