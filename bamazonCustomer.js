var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');
var connection = mysql.createConnection(
{
	host: "localhost",
	port: 3306,

	user: "root",
	password: "Lukkehoday1",
	database: "bamazon"
})

connection.query("SELECT * FROM products;", function(err, results)
{
	if(err){throw err;}

	var table = new Table(
	{
		head: ['id', 'Name', 'Deparment', 'Price', 'Stock Quantity'],
		 chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
		    , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
		    , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
		    , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
	});

	for (var i=0; i<results.length; i++)
	{
		table.push(
			[results[i].id, results[i].product_name, results[i].department_name, results[i].price, results[i].stock_quantity]	
		);
	}

	console.log(table.toString())
})
