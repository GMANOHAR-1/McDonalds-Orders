# McDelivery Orders Chrome Extension

A Chrome extension to fetch and display McDelivery orders using JWT authentication.

## Features

- Fetch and display a user's McDelivery order history.
- View order details including order ID, items, prices, and status.
- Display total spending across all orders.

## Installation

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable "Developer mode".
4. Click "Load unpacked" and select the extension's directory.
5. The extension should now be installed and ready to use.

## Structure

### Manifest (manifest.json)

- **Permissions**: Grants access to local storage, active tab, and the McDelivery API.
- **Content Script**: Injects a script into McDelivery pages to retrieve the JWT token from local storage.
- **Background Service Worker**: Manages API requests to fetch order details.

### Background Script (background.js)

1. **fetchOrders()**: 
   - Makes an API call to fetch order history using the JWT token.
   - Handles errors and formats the response into a structured order list.
   - Sends the order data to the popup for display.

2. **Message Listener**: 
   - Listens for messages from the content script with the JWT token.
   - Responds with either orders or an error message.

### Content Script (content.js)

- Extracts the JWT token from the local storage.
- Sends the token to the background script to fetch orders.

### Popup Script (popup.js)

1. **Event Listener**: 
   - Waits for the user to click "Fetch Orders" to fetch and display the order data.
   - Displays each order's details including items and prices.
   - Calculates and displays the total amount spent.

### Popup HTML (popup.html)

- Contains UI elements such as the "Fetch Orders" button and areas to display order details and total spending.

## API Integration

The extension interacts with the McDelivery API at:

- **API URL**: `https://be.mcdelivery.co.in/order/user-orders/`
- **Method**: POST
- **Headers**:
  - `authorization`: JWT token
  - `content-type`: application/json

## Requirements

- McDelivery account with active orders.
- JWT token stored in `localStorage` under the key `CapacitorStorage.token`.

 
 

