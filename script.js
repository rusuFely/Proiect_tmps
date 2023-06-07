// Pattern-uri creational
// 1. Factory Pattern
function ProductFactory() {
    this.createProduct = function(name, price, quantity) {
        return new Product(name, price, quantity);
    }
}

// 2. Singleton Pattern
const Cart = (function() {
    let instance;

    function createInstance() {
        let cartItems = [];

        return {
            addItem: function(product) {
                cartItems.push(product);
            },
            removeItem: function(product) {
                const index = cartItems.indexOf(product);
                if (index !== -1) {
                    cartItems.splice(index, 1);
                }
            },
            getItems: function() {
                return cartItems;
            },
            getTotal: function() {
                let total = 0;
                cartItems.forEach(function(item) {
                    total += item.getPrice() * item.getQuantity();
                });
                return total;
            },
            checkout: function() {
                console.log("Comanda finalizată. Total de plată:", this.getTotal(), "MDL");
                cartItems = [];
            }
        };
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// Pattern-uri structurale
// 1. Decorator Pattern
function ProductDecorator(product) {
    this.product = product;

    this.getPrice = function() {
        return this.product.getPrice();
    }

    this.getQuantity = function() {
        return this.product.getQuantity();
    }
}

function OrganicProduct(product) {
    ProductDecorator.call(this, product);

    this.getPrice = function() {
        return this.product.getPrice() * 1.1; // Adaugă un adaos de 10% pentru produse organice
    }
}

// 2. Proxy Pattern
function ProductProxy(name, price, quantity) {
    this.product = new Product(name, price, quantity);

    this.getPrice = function() {
        // Verifică dacă utilizatorul are drepturi speciale pentru a afișa
        // prețul
        if (isAdmin()) {
            return this.product.getPrice();
        } else {
            return "Acces restricționat la preț";
        }
    }

    this.getQuantity = function() {
        return this.product.getQuantity();
    }

    function isAdmin() {
        // Simulăm verificarea drepturilor de administrator
        return Math.random() < 0.5; // 50% șansa de a avea drepturi de administrator
    }
}

// Pattern-uri comportamentale
// 1. Observer Pattern
function Product(name, price, quantity) {
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.observers = [];

    this.addObserver = function(observer) {
        this.observers.push(observer);
    }

    this.removeObserver = function(observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    this.notifyObservers = function() {
        this.observers.forEach(function(observer) {
            observer.update();
        });
    }

    this.getPrice = function() {
        return this.price;
    }

    this.getQuantity = function() {
        return this.quantity;
    }

    this.setPrice = function(newPrice) {
        this.price = newPrice;
        this.notifyObservers();
    }

    this.setQuantity = function(newQuantity) {
        this.quantity = newQuantity;
        this.notifyObservers();
    }
}

function PriceObserver(product) {
    this.product = product;

    this.update = function() {
        console.log(`Prețul produsului ${this.product.name} a fost actualizat: ${this.product.getPrice()} MDL`);
    }
}
// ...

// ...

// 2. Strategy Pattern
function PaymentStrategy() {
    this.pay = function(amount) {
        throw new Error("Metoda trebuie suprascrisă în subclasă.");
    }
}

function CardPaymentStrategy() {
    PaymentStrategy.call(this);

    this.pay = function(amount) {
        console.log(`Plată efectuată prin card bancar în valoare de ${amount} MDL.`);
    }
}

function CashPaymentStrategy() {
    PaymentStrategy.call(this);

    this.pay = function(amount) {
        console.log(`Plată efectuată în numerar în valoare de ${amount} MDL.`);
    }
}

// Utilizarea design pattern-urilor
const productFactory = new ProductFactory();
const cart = Cart.getInstance();

// Adăugarea observatorului pentru preț
const product = productFactory.createProduct("Mere", 10, 5);
const priceObserver = new PriceObserver(product);
product.addObserver(priceObserver);

// Decorarea produsului cu decorator
const organicProduct = new OrganicProduct(product);

// Utilizarea proxy pentru produs
const proxyProduct = new ProductProxy("Pere", 8, 10);

// Setarea strategiilor de plată
const cardPaymentStrategy = new CardPaymentStrategy();
const cashPaymentStrategy = new CashPaymentStrategy();

function makePayment(amount, paymentStrategy) {
    paymentStrategy.pay(amount);
}

// // Exemplu de plată
// makePayment(100, cardPaymentStrategy);

// Funcția de adăugare a produsului
function addProduct() {
    const name = document.getElementById("name").value;
    const price = parseFloat(document.getElementById("price").value);
    const quantity = parseInt(document.getElementById("quantity").value);

    if (name && !isNaN(price) && !isNaN(quantity)) {
        const newProduct = productFactory.createProduct(name, price, quantity);
        cart.addItem(newProduct);
        displayProducts();
        displayTotal();
    }
}

// ...

// ...

// Funcția de ștergere a produsului din listă
// Funcția de ștergere a produsului din listă
function removeProduct(index) {
    const items = cart.getItems();
    const removedProduct = items[index];
    cart.removeItem(removedProduct);
    displayProducts();
    displayTotal();
}


// Funcția de afișare a produselor în listă
// Funcția de afișare a produselor în listă
function displayProducts() {
    const productList = document.getElementById("products");
    productList.innerHTML = "";

    const items = cart.getItems();
    items.forEach(function(item, index) {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ${item.getPrice()} MDL - Cantitate: ${item.getQuantity()} - Total: ${item.getPrice() * item.getQuantity()} MDL`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Șterge";
        deleteButton.addEventListener("click", function() {
            removeProduct(index);
        });

        li.appendChild(deleteButton);
        productList.appendChild(li);
    });
}


// ...

// Asigurați-vă că funcția displayProducts() este apelată inițial pentru a afișa produsele la început
displayProducts();



// Funcția de calculare și afișare a totalului
function displayTotal() {
    const total = cart.getTotal();
    const totalElement = document.getElementById("total");
    totalElement.textContent = `Total: ${total} MDL`;
}

// Funcția de finalizare a comenzii
function checkout() {
    const total = cart.getTotal();

    if (total > 0) {
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        switch (paymentMethod) {
            case "card":
                makePayment(total, cardPaymentStrategy);
                break;
            case "cash":
                makePayment(total, cashPaymentStrategy);
                break;
            default:
                console.log("Metoda de plată invalidă.");
        }

        cart.checkout();
        displayProducts();
        displayTotal();
    } else {
        console.log("Coșul de cumpărături este gol. Nu se poate finaliza comanda.");
    }
}