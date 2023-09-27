import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const getEwon = async () => {
  const url = 'https://data.talk2m.com/getewon';
  const data = new URLSearchParams();
  data.append('t2mdevid', '24d72546-cbf3-4fec-a2d4-f9870062bc2c');
  data.append('t2mtoken', 'LvpG4m3W7NWK5nNdbj59zKWStSPO6HE7d439Q8qV7JCN15xxSA');
  data.append('id', '1425275');

  try {
    const res = await axios.post(url, data);
    return res.data;
  } catch (error) {
    console.error('Erreur:', error);
  }
};
