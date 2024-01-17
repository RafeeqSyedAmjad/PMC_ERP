// Populate customer dropdown
$.get('https://pmcsaudi-uat.smaftco.com:3083/api/customer-product-service/', function (data) {
    var customerSelect = $('#customerSelect');

    // Add default option
    customerSelect.append('<option value="">Select Customer</option>');

    // Populate dropdown with customer data
    data.customers.forEach(function (customer) {
        customerSelect.append('<option value="' + customer.id + '">' + customer.customerName + '</option>');
    });

    // Function to reset and hide customer details
    function resetCustomerDetails() {
        $('#customerDetails').html(''); // Clear details
        $('#customerDetails').hide(); // Hide details section
    }

    // Function to display customer details
    function showCustomerDetails(selectedCustomer) {
        if (selectedCustomer) {
            $('#customerDetails').html('<div class="profile-card"><p>Name: ' + selectedCustomer.customerName + '</p>' + '<p>Email: ' + selectedCustomer.customerEmail + '</p>' + '<p>Mobile No. ' + selectedCustomer.customerPhone + '</p>' + '<p>Address: ' + selectedCustomer.customerAddress + '</p>' + '<p>Customer Type: ' + selectedCustomer.customerType + '</p></div>');
            $('#customerDetails').show(); // Show details section
        } else {
            resetCustomerDetails(); // Reset and hide details
        }
    }

    // Handle customer selection
    customerSelect.change(function () {
        var selectedCustomerId = $(this).val();

        if (selectedCustomerId === "") {
            // If "--Select Customer--" is chosen, reset and hide customer details
            showCustomerDetails(null);
        } else {
            var selectedCustomer = data.customers.find(function (customer) {
                CustomerId = customer.id;
                return customer.id == selectedCustomerId;
            });
            CustomerType = selectedCustomer.customerType;

            selectedCustomerArray = selectedCustomer;
            // Display customer details
            showCustomerDetails(selectedCustomer);
        }
    });
});
        });




        // function to sdarch products


function searchProducts() {
    var searchKeyword = $('#searchBox').val();

    if (!searchKeyword.trim()) {
        $('#productList').empty();
        return;
    }

    $.ajax({
        url: 'https://pmcsaudi-uat.smaftco.com:3083/api/products/',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            displayProducts(filterProducts(data, searchKeyword));
        },
        error: function (error) {
            console.error('Error fetching products:', error);
        }
    });
}



function filterProducts(products, keyword) {
    return products.filter(function (product) {
        var lowerKeyword = keyword.toLowerCase();
        return (
            product.name.toLowerCase().includes(lowerKeyword) ||
            product.brand.toLowerCase().includes(lowerKeyword) ||
            product.part_number.toLowerCase().includes(lowerKeyword)
        );
    });
}

function displayProducts(products) {
    var productList = $('#productList');
    productList.empty();

    if (products.length === 0) {
        productList.append('<li>No products found.</li>');
    } else {
        products.forEach(function (product) {
            //console.log(product);
            // Include a button for each product
            var productItem = $('<li class="productItem">' + product.name + ' - ' + product.brand + ' - ' + product.part_number + '</li>');

            var productButton = $('<button id="add-btn" class="btn productButton">Add</button>');
            productItem.append(productButton);
            $('#productList').append(productItem);
            productButton.click(function () {

                handleButtonClick([{
                    price1: product.price1,
                    price2: product.price2,
                    price3: product.price3,
                    price4: product.price4,
                    price5: product.price5,
                    name: product.name,
                    brand: product.brand,
                    part_number: product.part_number,
                    productid: product.id,
                    image: product.image1
                }]);

            });
            productItem.append(productButton);
            productList.append(productItem);
            //console.log(product.name);
        });
    }
}
//let quotation_products = [];
var unitPrice = 0;




  // Populate the totals in the table
            let table = `
        <table>
            <thead>
                <!-- Your table header content -->
                <tr>
                                                    <th style="width: 50px;" rowspan="2">No</th>
                                                    <th style="width: 150px;" rowspan="2">Item Picture</th>
                                                    <th style="width: 400px;" rowspan="2">Item Name</th>
                                                    <th style="width: 50px;" rowspan="2">QTY</th>
                                                    <th colspan="3" style="width: 200px;"><strong>Price(SAR)</strong>
                                                    </th>

                                                </tr>
                                                <tr>
                                                    <th style="width: 100px;">Unit Price</th>
                                                    <th style="width: 50px;">%</th>
                                                    <th style="width: 100px;">Value</th>
                                                </tr>
            </thead>
            <tbody>
                ${tableRows}
                <tr>
                    <td style="border-bottom-style: hidden; border-left-style: hidden;"
                                                        rowspan="5" colspan="4">
                                                    </td>
                    <td colspan="2"><strong>Total</strong></td>
                    <td>${grandTotalPriceElement}</td>
                </tr>
                <tr>
                    <td colspan="2"><strong>Discount</strong></td>
                    <td>${grandTotalDiscountElement}</td>
                </tr>
                <tr>
                    <td colspan="2"><strong>Net</strong></td>
                    <td>${grandTotalPriceElement}</td>
                </tr>
                <tr>
                    <td colspan="2"><strong>VAT 15%</strong></td>
                    <td>${grandTotalVatAmountElement}</td>
                </tr>
                <tr>
                    <td colspan="2"><strong>Total + VAT</strong></td>
                    <td>${grandTotalPriceWithVatElement}</td>
                </tr>
            </tbody>
        </table>`;

            // Assuming you want to append this table to an element with id 'tableContainer'
            document.getElementById('ProductTable').innerHTML = table;
        }