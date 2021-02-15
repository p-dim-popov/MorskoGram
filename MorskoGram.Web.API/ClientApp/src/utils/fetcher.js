import mime from 'mime-types';
import authService from '../components/api-authorization/AuthorizeService';

const generateOptions = (token, data = null, overrides = null) => {
  const options = {
    method: 'POST',
    redirect: 'manual',
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
        'Content-Type': mime.contentType('json'),
      },
      body: JSON.stringify(data),
    });
  }

  if (overrides) {
    Object.assign(options, overrides);
  }

  return options;
};

const fromRequest = (request) => async (endpoint, data = null, overrides = null) => {
  const token = await authService.getAccessToken();
  const response = await request({
    endpoint, data, overrides, token,
  });
  return response?.json();
};

export const getAsync = fromRequest(
  (_) => fetch(_.endpoint, generateOptions(_.token, _.data, {
    method: 'GET',
    ..._.overrides,
  })),
);

export const postAsync = fromRequest(
  (_) => fetch(_.endpoint, generateOptions(_.token, _.data, _.overrides)),
);

export const deleteAsync = fromRequest(
  (_) => fetch(_.endpoint, generateOptions(_.token, _.data, {
    method: 'DELETE',
    ..._.overrides,
  })),
);

const Fetcher = {
  getAsync,
  postAsync,
  deleteAsync,
};
export default Fetcher;
