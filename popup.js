document.addEventListener("DOMContentLoaded", () => {
  const fetchOrdersBtn = document.getElementById("fetch-orders");
  const ordersContainer = document.getElementById("orders");
  const totalSpentEl = document.getElementById("total-spent");

  fetchOrdersBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => {
            const jwtToken = localStorage.getItem("CapacitorStorage.token");
            return jwtToken && jwtToken.startsWith('"') && jwtToken.endsWith('"')
              ? jwtToken.slice(1, -1).trim()
              : jwtToken?.trim();
          },
        },
        (results) => {
          if (results && results[0] && results[0].result) {
            const jwtToken = results[0].result;
            chrome.runtime.sendMessage(
              { type: "AUTH_TOKEN", token: jwtToken },
              (response) => {
                if (response.error) {
                  console.error("Error fetching orders:", response.error);
                  ordersContainer.innerText = "Error: " + response.error;
                  return;
                }
                ordersContainer.innerHTML = "";
                let totalSpent = 0;
                const orders = response.orders;
 
                orders.forEach((order) => {
                  totalSpent += order.orderTotal;

                  const orderEl = document.createElement("div");
                  orderEl.classList.add("order");

                  orderEl.innerHTML = `
                    <p><strong>Order ID:</strong> ${order.orderId}</p>
                    <p><strong>Date:</strong> ${order.orderDate}</p>
                    <p><strong>Total:</strong> ₹${order.orderTotal.toFixed(2)}</p>
                    <div class="order-details">
                      <ul>
                        ${order.items
                          .map(
                            (item) => `
                              <li>
                                
                                <strong>${item.itemName}</strong> - ₹${item.price.toFixed(
                                  2
                                )} (${item.status})
                              </li>
                            `
                          )
                          .join("")}
                      </ul>
                    </div>
                  `;

                  ordersContainer.appendChild(orderEl);
                });

               
                totalSpentEl.innerHTML = `
                  <p><strong>Order Count:</strong> ${orders.length}</p>
                  <p><strong>Total Amount Spent:</strong> ₹${totalSpent.toFixed(2)}</p>
                `;
              }
            );
          } else {
            console.error("Failed to retrieve JWT token.");
            ordersContainer.innerText = "Error: JWT token not found.";
          }
        }
      );
    });
  });
});
