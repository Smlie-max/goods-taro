import Request from '../../utils/request';

export const getProductInfo = data => Request({
  url: '&r=member.login.test',
  method: 'GET',
  data,
});