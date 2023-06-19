
//autosuggest code
let pickupMap;
let dropoffMap;

function GetMaps() {
    pickupMap = new Microsoft.Maps.Map('#pickupMap', {});
    dropoffMap = new Microsoft.Maps.Map('#dropoffMap', {});

    Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
        var options = {
            countryFilter: 'NGA' // Specify the country code for Nigeria
        };

        var manager1 = new Microsoft.Maps.AutosuggestManager({ map: pickupMap, options: options });
        manager1.attachAutosuggest('#pickupSearchBox', '#pickupSearchBoxContainer', pickupSelectedSuggestion);

        var manager2 = new Microsoft.Maps.AutosuggestManager({ map: dropoffMap, options: options });
        manager2.attachAutosuggest('#dropoffSearchBox', '#dropoffSearchBoxContainer', dropOffSelectedSuggestion);
    });
}


function pickupSelectedSuggestion(result) {
    pickupMap.entities.clear();
    let pin = new Microsoft.Maps.Pushpin(result.location);
    pickupMap.entities.push(pin);
    pickupMap.setView({ bounds: result.bestView });
    document.getElementById('pickupSearchBox').value = result.formattedSuggestion;
    document.getElementById('pickupSearchBoxValue').value = result.formattedSuggestion;

}
function dropOffSelectedSuggestion(result) {
    dropoffMap.entities.clear();
    let pin = new Microsoft.Maps.Pushpin(result.location);
    dropoffMap.entities.push(pin);
    dropoffMap.setView({ bounds: result.bestView });

    document.getElementById('dropoffSearchBox').value = result.formattedSuggestion;
    document.getElementById('dropoffSearchBoxValue').value = result.formattedSuggestion;
}

//order script


// Get the form element
const orderForm = document.getElementById('orderForm');

// document.querySelector('#btn').addEventListener('click', () => {
//    
// })


// Add an event listener for the form submission
orderForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const hiddenDiv = document.querySelector('.hiddenDiv')
    hiddenDiv.style.display = 'block';
    setTimeout(() => {
        hiddenDiv.style.display = 'none';
    }, 3000); // 5 seconds (5000 milliseconds)

    try {
        const response = await fetch('/orders', {
            method: 'POST',
            body: new URLSearchParams(new FormData(orderForm)),
        });

        if (response.ok) {
            // Order placed successfully
            const data = await response.json();
            const order = data.populatedOrder
            // Update the modal content with the order data
            const orderModalTitle = document.getElementById('staticBackdropLabel');
            const orderModalBody = document.querySelector('.modal-body h4');
            const orderRiderButton = document.querySelector('.modal-footer .btn-primary');



            orderModalTitle.textContent = 'Order placed successfully';
            orderModalBody.innerHTML =
                `Order ID: ${order.orderNumber}<br>` +
                `Type of Item: ${order.itemType}<br>` +
                `Order Date: ${order.orderDate}<br>` +
                `Distance: ${order.OrderDuration.distance_km} km<br>` +
                `Order Amount: ${order.OrderAmount}`;



            // Display the modal
            var myModalEl = document.getElementById('staticBackdrop');
            var modal = new bootstrap.Modal(myModalEl, {
                backdrop: 'static',
                keyboard: false
            });

            modal.show();
        } else {
            // Handle the error case
            const errorData = await response.json();

            if (errorData.itemTypeError) {
                const itemTypeError = errorData.itemTypeError;
                errorTimeOut(itemTypeError)
                return console.error(itemTypeError);
            } else if (errorData.validError) {
                const validError = errorData.validError
                errorTimeOut(validError)
                return console.log(validError)
            }

            console.log(errorData)
        }
    } catch (error) {
        console.error(error);
    }
});

const closeModalButtons = document.querySelectorAll('#closeModalButton');
closeModalButtons.forEach((button) => {
    button.addEventListener('click', () => {
        // Redirect to another page
        window.location.href = '/customer/orders';
    });
});

function errorTimeOut(errMsg) {
    const errorContainer = document.getElementById('errorContainer');
    errorContainer.textContent = errMsg;
    setTimeout(() => {
        errorContainer.textContent = " "
    }, 3000);
}


