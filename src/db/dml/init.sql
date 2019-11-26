create database address_book_api;

create table if not exists address_book
(
	id serial not null
		constraint address_book_pk
			primary key,
	username varchar(50) not null,
	password varchar(500) not null
);

create unique index if not exists address_book_username_uindex
	on address_book (username);

create table if not exists contact_group
(
	id varchar(1000) not null
		constraint contact_group_pk
			primary key,
	name varchar(100),
	description varchar(500),
	picture_url varchar(500),
	address_book_id integer not null
		constraint contact_group_address_book_id_fk
			references address_book
);

create table if not exists contact
(
	name varchar(100) not null
		constraint contact_pk
			primary key,
	phone varchar(200),
	picture_url varchar(500),
	group_id varchar(1000)
		constraint contact_contact_group_id_fk
			references contact_group,
	address_book_id integer not null
		constraint contact_address_book_id_fk
			references address_book
);
