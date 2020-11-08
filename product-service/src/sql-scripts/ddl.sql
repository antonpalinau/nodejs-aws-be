CREATE extension if not exists "uuid-ossp";

drop table if exists product
drop table if exists stock

create table if not exists product (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price numeric(6,2)
)

create table if not exists stock (
	id uuid primary key default uuid_generate_v4(),
	product_id uuid,
	count int,
	constraint product_id foreign key(product_id) references product(id) on delete cascade
)
