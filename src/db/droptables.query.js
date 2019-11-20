import database from './index';

const text = 'drop table users,roles';

const drop = async () => {
  try {
    await database.query(text);
  } catch (err) {
    console.error(err);
  }
};

drop();
