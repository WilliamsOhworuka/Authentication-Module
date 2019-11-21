import database from './index';

const userText = `create table if not exists users(
    id serial primary key,
    firstName varchar(30) not null,
    lastName varchar(30) not null,
    email varchar(50) unique not null,
    password varchar(128) not null,
    confirmed boolean default false,
    verificationtoken varchar(200)
)`;

const rolesText = `create table if not exists roles(
    id serial primary key,
    name varchar(100) not null,
    read boolean not null,
    publish boolean not null,
    write boolean not null
)`;

const userrolesText = `create table if not exists userroles(
  id serial primary key,
  userid int references users(id) not null,
  roleid int references roles(id) default 3
)`;

const create = async () => {
  try {
    await database.query(rolesText);
    await database.query(userText);
    await database.query(userrolesText);
  } catch (err) {
    console.error('creation', err);
  }
};

create();
