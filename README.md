# bamazon
This is a short academic app demonstrating the how to connect MySQL and Node.js. It functions as a mock web store with three different functionalities; Customer, Manager, and Supervisor.

## Install
`npm install`

## Commands
* `node bamazonCustomer.js`:
initiates the Customer view of Bamazon.  Customers can buy items.
* `node bamazonManager.js`:
initiates the Manager view of Bamazon.  Managers can view items with their departments and stock quantities.  They may also view only items in low stock, restock items, and add new items to current departments.
* `node bamazonSupervisor.js`:
initiates the Supervisor view of Bamazon.  Supervisors can view the Product by Sales table showing them how much money each department has made, the over head costs of each department, and the total profits which is the subtraction of over head costs from product sales.  They also are able to create new departments.

## Database Structure
The MySQL Database is called bamazon.  It includes two tables.
### bamazon.products

id | product_name | department_name | price | stock_quantity | product_sales 
------------ | ------------- |------------ | ------------- | ------------ | -------------
int(20) AI PK | varchar(50) | varchar(50) | decimal(50, 2) | int(20) | decimal(50, 2)

### bamazon.departments

id | department_name | over_head_costs
------------ | ------------- |------------
int(20) AI PK | varchar(50) | decimal(50, 2) 

## Video Demonstration
<a href="https://youtu.be/9YW2XWnSX3c" target="_blank">Click Here!</a>
