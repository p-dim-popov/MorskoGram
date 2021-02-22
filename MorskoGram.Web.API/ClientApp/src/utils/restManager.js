import authService from '../components/api-authorization/AuthorizeService';

/**
 * @param {Response} response
 */
export const restManager = (response) => {
    const x = response.status.toString();
    switch (true) {
    case /^2\d\d$/.test(x):
        return response;
    case /^404$/.test(x):
        // TODO: Message below navmenu
        break;
    case /^400$/.test(x):
        authService.signIn();
        break;
    default:
        return response;
    }
    return undefined;
};
