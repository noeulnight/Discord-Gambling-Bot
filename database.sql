create user gambling@localhost;
create schema gambling;
grant all privileges on gambling.* to gambling@localhost;
use gambling;

create table users (
  id varchar(30) not null primary key,
  coin int not null,
  createdAt timestamp default current_timestamp not null
);
