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

var viewProductsBySale = function()
{
	var departments = []
	var products = []
	var salesPerDepartment = []
	var totalProfits = []

	connection.query("SELECT * FROM departments;", function(err, result1)
	{
		if(err){throw err}

		departments = result1

		connection.query("SELECT * FROM products;", function(err, result)
		{
			if(err){throw err}

			products = result

			for (var i=0; i<departments.length; i++)
			{
				salesPerDepartment.push(0)

				for (var j=0; j<products.length; j++)
				{
					if (products[j].department_name === departments[i].department_name)
					{
						salesPerDepartment[i] = salesPerDepartment[i] + products[j].product_sales;
					}
				}

				totalProfits.push(salesPerDepartment[i] - departments[i].over_head_costs)
			}

			var table = new Table(
			{
				head: ['Department ID', 'Department Name', 'Over Head Costs', 'Product Sales', 'Total Profit'],
				chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
				    , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
				    , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
				    , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
			});

			for (var i=0; i<departments.length; i++)
			{
				table.push(
					[departments[i].department_id, departments[i].department_name, departments[i].over_head_costs, salesPerDepartment[i], totalProfits[i]]
				);
			}

			console.log(table.toString())

			run()
		})
	})
}

var newDepartment = function()
{
	connection.query("SELECT department_name FROM departments;", function(err, result)
	{
		if(err){throw err}
		

		inquirer.prompt(
			[{
				name: 'newDeptName',
				type: 'input',
				message: "What is the name of this new department?",
				validate: function(input)
				{
					for (var i=0; i<result.length; i++)
					{
						if (input === result[i].department_name)
						{
							console.log("\nThis department already exists!");
							return false;
						}
					}

					return true;
				}
			},
			{
				name: 'newOverHead',
				type: 'input',
				message: 'What is the over head cost for this new department?',
				validate: function(input)
				{
					if (isNaN(input))
					{
						console.log("\nPlease give me a number")
						return false;
					}

					return true;
				}
			}]).then(function(answer)
			{
				connection.query("INSERT INTO departments(department_name, over_head_costs) VALUES (?, ?);",
				[answer.newDeptName, answer.newOverHead], function(err, result)
				{
					if(err){throw err}

					console.log("\n"+answer.newDeptName+" added!")

					run()
				})
			})
	})
}

var run = function()
{
	inquirer.prompt(
		[{
			name: 'response',
			type: 'list',
			message: 'What would you like to do, sir?',
			choices: ['View Product Sales by Department', 'Make New Department', 'Exit']
		}]).then(function(answer)
		{
			if (answer.response === 'View Product Sales by Department')
			{
				viewProductsBySale()
			}

			else if (answer.response === 'Make New Department')
			{
				newDepartment()
			}

			else if (answer.response === 'Exit')
			{
				connection.end()
			}
	})
}

run()
