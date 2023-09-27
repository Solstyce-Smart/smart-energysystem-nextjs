import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getEwon = () => {
  const url = 'https://data.talk2m.com/getewon';
  const data = new URLSearchParams();
  data.append('t2mdevid', process.env.T2MDEVID);
  data.append('t2mtoken', process.env.T2MTOKEN);
  data.append('id', process.env.ID);

  axios
    .post(url, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error('Erreur:', error);
    });
};

getEwon();
