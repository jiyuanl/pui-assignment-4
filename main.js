/*** Shopping Cart Function ****/

var shoppingCart = (function () {
    // Private methods and properties
    var cart = [];

    function Item(name, price, count) {
        this.name = name
        this.price = price
        this.count = count
    }

    function saveCart() {
        localStorage.setItem("shoppingCart", JSON.stringify(cart));
    }

    function loadCart() {
        cart = JSON.parse(localStorage.getItem("shoppingCart"));
        if (cart === null) {
            cart = []
        }
    }

    loadCart();



    // Public methods and properties
    var obj = {};

    obj.addItemToCart = function (name, price, count) {
        loadCart();
        for (var i in cart) {
            if (cart[i].name === name) {
                cart[i].count += count;
                saveCart();
                return;
            }
        }

        console.log("addItemToCart:", name, price, count);

        var item = new Item(name, price, count);
        cart.push(item);
        saveCart();
    };

    obj.setCountForItem = function (name, count) {
        loadCart();
        for (var i in cart) {
            if (cart[i].name === name) {
                cart[i].count = count;
                break;
            }
        }
        saveCart();
    };


    obj.removeItemFromCart = function (name) { // Removes one item
        loadCart();
        for (var i in cart) {
            if (cart[i].name === name) { // "3" === 3 false
                cart[i].count--; // cart[i].count --
            if (cart[i].count === 0) {
                cart.splice(i, 1);
            }
            break;
        }
    }
    saveCart();
};


    obj.removeItemFromCartAll = function (name) { // removes all item name
        loadCart();
        for (var i in cart) {
            if (cart[i].name === name) {
                cart.splice(i, 1);
                break;
            }
        }
        saveCart();
    };


    obj.clearCart = function () {
        loadCart();
        cart = [];
        saveCart();
    }


    obj.countCart = function () { // -> return total count
        loadCart();
        var totalCount = 0;
        for (var i in cart) {
            totalCount += cart[i].count;
        }

        return totalCount;
    };

    obj.totalCart = function () { // -> return total cost
        loadCart();
        var totalCost = 0;
        for (var i in cart) {
            totalCost += cart[i].price * cart[i].count;
        }
        return totalCost.toFixed(2);
    };

    obj.listCart = function () { // -> array of Items
        loadCart();
        var cartCopy = [];
        console.log("Listing cart");
        console.log(cart);
        for (var i in cart) {
            console.log(i);
            var item = cart[i];
            var itemCopy = {};
            for (var p in item) {
                itemCopy[p] = item[p];
            }
            itemCopy.total = (item.price * item.count).toFixed(2);
            cartCopy.push(itemCopy);
        }
        return cartCopy;
    };

    return obj;
})();

/*** Document Load ****/
$(document).ready(function() {
    $("#cart-num").html(shoppingCart.countCart());
    $("#cart-numm").html(shoppingCart.countCart());
    $("#size").change(function(){ // -> dynamic display, change content according to user input
        if($(this).val() == "medium"){
            $("#size-des").text("Height: 40cm Width: 40cm");
            $("#price").text("1750");
            $("#fish").attr("src", "fish_.jpg");
        } else {
            $("#size-des").text("Height: 30cm Width: 30cm");
            $("#price").text("1250");
            $("#fish").attr("src", "fish.jpg");
        }
    })

    $("#buy").click(function(){ // -> add to cart
        var name =
        String($("#brand").text())
        +" "
        +String($("#product-name").text())
        +" ---- size:"
        +String($("#size option:selected").val())
        var price = Number($("#price").html());
        console.log(price);
        shoppingCart.addItemToCart(name, price,1);
        $("#cart-num").html(shoppingCart.countCart());
        $("#cart-numm").html(shoppingCart.countCart());
    })

    $("#clear-cart").click(function(){ // -> clear cart
        shoppingCart.clearCart();
        displayCart();
    });

    function displayCart() { // -> display cart
        var cartArray = shoppingCart.listCart();
        console.log(cartArray);
        var output = "";

        for (var i in cartArray) { // -> print each entry for shopping cart
            output += "<div class='cart-item'>"
            +cartArray[i].name
            +"<br>"
            +cartArray[i].count
            +" x "+cartArray[i].price
            +" = "+cartArray[i].total
            +"<br>"
            +" <button class='plus-item' data-name='"
            +cartArray[i].name+"'>+</button>"
            +" <button class='subtract-item' data-name='"
            +cartArray[i].name+"'>-</button>"
            +" <button class='delete-item' data-name='"
            +cartArray[i].name+"'>X</button>"
            +"<img class='asset2' src='asset1.png' >"
            +"</div>";
        }

        $("#show-cart").html(output);
        $("#count-cart").html( shoppingCart.countCart() );
        $("#total-cart").html( shoppingCart.totalCart() );
    }

    $("#show-cart").on("click", ".delete-item", function(){ // -> delete cart item
        var name = $(this).attr("data-name");
        shoppingCart.removeItemFromCartAll(name);
        displayCart();
    });

    $("#show-cart").on("click", ".subtract-item", function(){ // -> subtract cart item
        var name = $(this).attr("data-name");
        shoppingCart.removeItemFromCart(name);
        displayCart();
    });

    $("#show-cart").on("click", ".plus-item", function(){ // -> plus cart item
        var name = $(this).attr("data-name");
        shoppingCart.addItemToCart(name, 0, 1);
        displayCart();
    });
    displayCart();
})
