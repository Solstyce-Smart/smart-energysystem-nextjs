import { getEwon } from '../ewonApi/getEwon.js';

export const createTags = async (userId, id) => {
  const localhost = 'http://localhost:3000';
  const res = await getEwon();
  if (!res) {
    console.log('No data');
  }
  const tags = res.data.tags;
  await axios
    .post(`${localhost}/${userId}/installations/${id}/tags-live`, tags)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
