const fetchOrders = async (jwtToken) => {
    const apiUrl = "https://be.mcdelivery.co.in/order/user-orders/";
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "accept": "application/json, text/plain, */*",
          "authorization": `JWT ${jwtToken}`,
          "content-type": "application/json",
          "mds-pinfo": "product information",
          "referer": "https://mcdelivery.co.in/"
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const rawData = await response.json();
  
      if (!rawData || rawData.length === 0) {
        console.log("No orders found.");
        return { orders: [] };
      }
  
     
      const formattedOrders = rawData.map((order) => ({
        orderId: order.order_no,
        orderDate: new Date(order.order_placed_datetime).toLocaleDateString(),
        orderTotal: order.gross_price,
        items: order.order_detail.map((item) => ({
          itemId: item.item_id,
          itemName: item.item_name,
          price: item.discount_price,
          status: order.status.name,
          imageUrl: item.image_url,
        })),
      }));
  
     
      const output = {
        orders: formattedOrders,
      };
  
      console.log("Formatted Orders:", JSON.stringify(output, null, 2));
      return output;
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      return { error: error.message };
    }
  };
  
   
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "AUTH_TOKEN") {
      fetchOrders(message.token).then((response) => {
        sendResponse(response);
      });
      return true;  
    }
  
    if (message.type === "NO_AUTH_TOKEN") {
      console.warn("No auth token received.");
      sendResponse({ error: "No authentication token found." });
      return true;
    }
  });
  