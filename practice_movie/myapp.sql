/* create database myapp;
use myapp;
create table users(
	Id int auto_increment primary key,
    name varchar(100) not null
);

insert into users(name) values('Harry Potter');

select * from users;

update users set name='John' where id=7;
*/
CREATE DATABASE myapp;
USE myapp;

CREATE TABLE movies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

-- 示例数据（可选）
INSERT INTO movies (name) VALUES ('The Matrix'), ('Inception');
