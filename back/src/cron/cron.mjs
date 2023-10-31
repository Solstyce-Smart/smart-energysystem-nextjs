import axios from 'axios';
import dotenv from 'dotenv';
import cron from 'node-cron';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false,
});

dotenv.config();

const getDatas = async () => {
  const url = 'https://data.talk2m.com/getewon';
  const data = new URLSearchParams();
  data.append('t2mdevid', process.env.T2MDEVID);
  data.append('t2mtoken', process.env.T2MTOKEN);
  data.append('id', process.env.ID);
  const dataFiltered = [];
  const elasticFiltered = [];

  const config = {
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.ELASTICSEARCH_USERNAME}:${process.env.ELASTICSEARCH_PASSWORD}`,
      ).toString('base64')}`,
    },
  };

  await axios
    .post(url, data)
    .then((response) => {
      const lastSynchroDate = response.data.lastSynchroDate;
      const ewonId = response.data.id.toString();
      response.data.tags.forEach((tag) => {
        const { value, quality, alarmHint, ewonTagId, name } = tag;
        const adjustedDate = new Date();
        adjustedDate.setTime(adjustedDate.getTime() + 2 * 60 * 60 * 1000);

        if (ewonTagId === -1) {
          return;
        } else {
          dataFiltered.push({
            lastSynchroDate,
            dateReq: adjustedDate,
            value,
            quality,
            alarmHint,
            tagName: name,
            installationId: process.env.CENTRALEID,
          });
          elasticFiltered.push({
            dateReq: new Date(),
            ewonId,
            lastSynchroDate,
            quality,
            tagName: name,
            value,
          });
        }
      });
    })
    .catch((error) => {
      console.error('Erreur:', error);
    });

  await axios.post(
    `https://164.132.50.131:3001/${process.env.USERID}/installations/${process.env.CENTRALEID}/tags-live`,
    dataFiltered,
    { httpsAgent: agent, ...config },
  );

  try {
    await axios.post(
      `https://164.132.50.131:3001/elastic/${process.env.ELASTICSEARCH_INDEX}`,
      elasticFiltered,
      { httpsAgent: agent, ...config },
    );
  } catch (error) {
    console.error('Erreur:', error);
  }

  console.log('Cron job done');
};

cron.schedule('*/5 * * * *', () => {
  getDatas();
});
