DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

use bamazon;

CREATE TABLE products (
id INTEGER(20) not null auto_increment,
product_name VARCHAR(50),
department_name VARCHAR(50),
price DECIMAL(50, 2),
stock_quantity int(20),
product_sales DECIMAL(50, 2),
primary key(id)
);

CREATE TABLE departments (
department_id INTEGER(20) not null auto_increment,
department_name VARCHAR(50),
over_head_costs DECIMAL(50, 2),
primary key(department_id)
);

-- Putting in some initial products
INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales) VALUES
("Dudley's Old Tshirts",  "Clothing",	75,	42,	150),
("Circular Glasses", "Clothing", 20, 89, 40),
("Wand", "Equipment", 200, 983, 1800),
("Hogwarts, A History", "Equipment", 150, 1000, 0),
("Polyjuice", "Potion", 100, 3595,	70500);

-- Putting in some intial departments
INSERT INTO departments(department_name, over_head_costs) VALUES
("Clothing", 10000),
("Equipment", 3000),
("Potions", 45000);