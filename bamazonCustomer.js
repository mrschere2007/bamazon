var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Your password
    password: "yourRootPassword",
    database: "bamazon"
});

connection.connect(function(error){
    if(error){
        console.log("error connecting: " +error);
    }
    loadProducts();
})
function loadProducts(){
    connection.query("SELECT * FROM products", function(error, results){
        if(error)
        throw error;
        console.table(results);
        promptCustomer(results);
    })
}
function promptCustomer(products){
    inquirer.prompt([
        {
            type: "input",
            name: "choice",
            message: "What is the Id of the product you need to buy",
            validate: function(val){
                return !isNaN(val);
            }
        }
    ])
    .then(function(val){
        var product = checkInventory(parseInt(val.choice), products);
        if(product){
            promptForQuanity(product);
        }
        else{
            console.log("the item is not in the inventory");
            loadProducts();
        }
    })
}
function promptForQuanity(products){
    inquirer.prompt([
        {
            type: "input",
            name: "quantity",
            message: "How many of they do you need?",
            validate: function(val){
                return !isNaN(val) || val.toLowerCase() === "q";
            }
        }
    ])
    .then(function(val){
        
        var quantity = parseInt(val.quantity);
        if(quantity> products. stock_quantity){
            console.log("insufficent quantity");
            loadProducts();
        }
        else{
            makePurchase(products,quantity);
        }
    })

}
function makePurchase(product, quantity){
    connection.query("UPDATE products SET  stock_quantity =  stock_quantity - ? WHERE item_id = ?", [quantity, product.item_id],
    function(error, res){
        if(error){
            throw error;
        }
        console.log("Sucess purchasing");
        loadProducts();
    })
}
function checkInventory(choiceId, products){
    for(var i=0; i< products.length; i++){
        if(products[i].item_id === choiceId){
            return products[i];
        }
    }
    return null;
}