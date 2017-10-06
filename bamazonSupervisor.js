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

inquirer.prompt(
	[{
		name: 'response',
		type: 'list',
		message: 'What would you like to do, sir?',
		choices: ['View Product Sales by Department', 'Make New Department']
	}]).then(function(answer)
	{
		if (answer.response === 'View Product Sales by Department')
		{
			console.log("Viewing products by sale")
		}

		else if (answer.response === 'Make New Department')
		{
			console.log("Making a new Department")
		}
	})
