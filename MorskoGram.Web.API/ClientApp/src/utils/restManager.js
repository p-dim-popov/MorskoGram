import authService from '../components/api-authorization/AuthorizeService';

/**
 * @param {Response} response
 */
export const restManager = (response) => {
    switch (response.status) {
    case 401:
        authService.signIn();
        break;
    default: return response;
    }
    return undefined;
};
