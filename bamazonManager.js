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

var updateDatabase = function(id, numberToStock, currentStock)
{
	var newStock = currentStock + numberToStock;
	connection.query("UPDATE products SET ? WHERE ?",
		[{stock_quantity:newStock}, {id:id}], function(err, result)
		{
			if(err){throw err}
		});
}

var viewProductsForSale = function()
{
	connection.query("SELECT * FROM products;", function(err, results)
	{
		if(err){throw err;}

		var table = new Table(
		{
			head: ['id', 'Name', 'Price', 'Department', 'Stock'],
			chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
			    , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
			    , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
			    , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
		});

		for (var i=0; i<results.length; i++)
		{
			table.push(
				[results[i].id, results[i].product_name, results[i].price, results[i].department_name, results[i].stock_quantity]	
			);
		}

		console.log("------------------WHAT WE CURRENTLY HAVE------------------")
		console.log(table.toString())
		run()
	});
}

var viewLowInventory = function()
{
	connection.query("SELECT * FROM products;", function(err, results)
	{
		if(err){throw err;}

		var table = new Table(
		{
			head: ['id', 'Name', 'Price', 'Department', 'Stock'],
			chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
			    , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
			    , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
			    , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
		});

		for (var i=0; i<results.length; i++)
		{
			if (results[i].stock_quantity < 5)
			{
				table.push(
					[results[i].id, results[i].product_name, results[i].price, results[i].department_name, results[i].stock_quantity]	
				);
			}
		}

		console.log("------------------WHAT WE ARE LOW ON------------------")
		console.log(table.toString())
		run()
	});
}

var addToInventory = function()
{
	connection.query("SELECT * FROM products;", function(err, results)
	{
		if(err){throw err}

		var indexToBuy = 0;
		var numberToStock = 0;

		inquirer.prompt(
			[{
				name: "idToBuy",
				type: "input",
				message: "What is the ID of the item you'd like add stock to?",
				validate: function(input)
				{
					for (var i=0; i<results.length; i++)
					{
						if (parseInt(input)===results[i].id)
						{
							indexToBuy = i;
							return true;
						}
					}

					console.log("\n----ERROR: Please input one of the above ID numbers----")
				}
			}]).then(function(answer)
			{
				inquirer.prompt(
					[{
						name: 'stockToAdd',
						type: "input",
						message: "How much would you like to restock?",
						validate: function(input)
						{
							if(isNaN(input))
							{
								return false;
							}

							numberToStock = parseInt(input)
							return true;
						}
					}]).then(function(answer2)
					{
						var id = indexToBuy + 1;
						updateDatabase(id, numberToStock, results[indexToBuy].stock_quantity)
						run()
					})
			})
	})
}

var addNewProduct = function()
{
	var newName = "";
	var newDepartment = "";
	var newPrice = 0;
	var newStock = 0;
	inquirer.prompt(
		[{
			name:"newProductName",
			type:'input',
			message: "What is the name of the new product?"
		}]).then(function(answer)
		{
			newName = answer.newProductName
			connection.query("SELECT DISTINCT department_name FROM products;", function(err, results)
			{
				var departments = []
				if(err){throw err}

				for (var i=0; i<results.length; i++)
				{
					departments.push(results[i].department_name)
				}

				departments.push("New Department")

				inquirer.prompt(
					[{
						name: 'newDepartmentName',
						type: 'list',
						message: "What department does this new product belong to?",
						choices: departments
					}]).then(function(answer2)
					{
						if (answer2.newDepartmentName === "New Department")
						{
							inquirer.prompt(
								[{
									name:"brandNewDep",
									type: "input",
									message: "What is the name of this new department?"
								}]).then(function(answer3)
								{
									newDepartment = answer3.brandNewDep
							})
						}

						else
						{
							newDepartment = answer2.newDepartmentName;
						}

						inquirer.prompt(
							[{
								name: "newPriceAmount",
								type: "input",
								message: "How much does "+newName+" cost?",
								validate: function(input)
								{
									if (isNaN(input))
									{
										console.log("You need to give me a number.")
										return false;
									}

									return true;
								}
							}]).then(function(answer4)
							{
								newPrice = parseInt(answer4.newPriceAmount)

								inquirer.prompt(
									[{
										name: 'newStockAmount',
										type: 'input',
										message: 'What is the intial stock of this product?',
										validate: function(input)
										{
											if (isNaN(input))
											{
												console.log("You need to give me a number.")
												return false;
											}

											return true;		
										}
									}]).then(function(answer5)
									{
										newStock = parseInt(answer5.newStockAmount)
										console.log("Name: "+newName)
										console.log("Department: "+newDepartment)
										console.log("Price: "+newPrice)
										console.log("Stock: "+newStock)
									})
							})
				})
			})
	})
}

var run = function()
{
	inquirer.prompt(
		[{
			name: 'action',
			type: 'list',
			message: "What would you like to do sir?",
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
		}]).then(function(answer)
		{
			if (answer.action === 'View Products for Sale')
			{
				viewProductsForSale()
			}

			else if (answer.action === 'View Low Inventory')
			{
				viewLowInventory()
			}

			else if (answer.action === 'Add to Inventory')
			{
				addToInventory()
			}

			else if (answer.action === 'Add New Product')
			{
				addNewProduct()
			}
	})
}

run()