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

var updateDatabase = function(id, amountBought, currentStock, currentSales, revenue)
{
	var money = revenue + currentSales
	var newStock = currentStock - amountBought;
	connection
	connection.query("UPDATE products SET ? , ? WHERE ? ",
		[{stock_quantity:newStock}, {product_sales:money}, {id:id}], function(err, result)
		{
			if(err){throw err}
		});
}

var buyAgain = function(string)
{
	inquirer.prompt(
		[{
			name: "confirm",
			type: "confirm",
			message: string,
		}]).then(function(answer)
		{
			if (answer.confirm)
			{
				buy()
			}

			else
			{
				console.log("We hope to see you again soon!")
				connection.end()
			}
		})
}

var buy = function ()
{
	connection.query("SELECT * FROM products;", function(err, results)
	{
		if(err){throw err;}

		var table = new Table(
		{
			head: ['id', 'Name', 'Price'],
			chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
			    , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
			    , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
			    , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
		});

		for (var i=0; i<results.length; i++)
		{
			table.push(
				[results[i].id, results[i].product_name, results[i].price]	
			);
		}

		console.log("------------------WELCOME TO BAMAZON!------------------")
		console.log(table.toString())

		var indexToBuy = 0;
		var numberToBuy = 0;

		inquirer.prompt(
			[{
				name: "idToBuy",
				type: "input",
				message: "What is the ID of the item you'd like to buy?",
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
						name: 'stockToBuy',
						type: "input",
						message: "How much would you like to buy?",
						validate: function(input)
						{
							if(isNaN(input))
							{
								return false;
							}

							else if (parseInt(input) > results[indexToBuy].stock_quantity)
							{
								console.log("\n----ERROR: We don't have that much in stock----")
								return false;
							}

							numberToBuy = parseInt(input)
							return true;
						}
					}]).then(function(answer2)
					{
						inquirer.prompt(
							[{
								name: "confirm",
								type: "confirm",
								message: "You want to buy "+numberToBuy+" "+results[indexToBuy].product_name+"(s)?"
							}]).then(function(answer3)
							{
								if (answer3.confirm)
								{
									var id = indexToBuy + 1;
									var cost = numberToBuy*results[indexToBuy].price
									updateDatabase(id, numberToBuy, results[indexToBuy].stock_quantity, results[indexToBuy].product_sales, cost)
									console.log("You have spent $"+cost+" on this purchase.")

									buyAgain("Would you like to buy something else?")
								}

								else
								{
									buyAgain("Would you like to try again?")
								}
							})
					})
			})
	})
}

buy()
