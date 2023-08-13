async function fetchData() {
    try {
      const response = await fetch('https://64b6c571df0839c97e161925.mockapi.io/cart');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }
  
  async function updateStatus(item, orderstatus) {
    try {
      const response = await fetch(`https://64b6c571df0839c97e161925.mockapi.io/cart/${item.id}`, {
        method: "PATCH", // Use PATCH method for partial updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderstatus }), // Change "status" to "orderstatus"
      });
  
      if (response.ok) {
        console.log(`Status "${orderstatus}" updated successfully for item with ID ${item.id}`);
      } else {
        console.error(`Error updating status "${orderstatus}" for item with ID ${item.id}`);
      }
    } catch (error) {
      console.error(`Error updating status "${orderstatus}" for item with ID ${item.id}:`, error);
    }
  }
  
  function createForm(item) {
    const formContainer = document.getElementById('filteredDataContainer');
    
    const form = document.createElement('form');
    form.className = 'product-form';
    
    const labels = ['Product ID', 'Category', 'Quantity', 'Address'];
    const inputs = ['productid', 'category', 'quantity', 'address'];
    
    labels.forEach((labelText, index) => {
      const label = document.createElement('label');
      label.setAttribute('for', inputs[index]);
      label.textContent = labelText + ':';
      
      const input = document.createElement('input');
      input.setAttribute('type', index === 2 ? 'number' : 'text');
      input.setAttribute('id', inputs[index]);
      input.setAttribute('name', inputs[index]);
      input.setAttribute('required', true);
      
      form.appendChild(label);
      form.appendChild(input);
    });
  
    const statusLabel = document.createElement('label');
    statusLabel.setAttribute('for', 'status');
    statusLabel.textContent = 'Status:';
  
    const statusSelect = document.createElement('select');
    statusSelect.setAttribute('id', 'status');
    statusSelect.setAttribute('name', 'status');
  
    const statusOptions = ['Select one', 'Ordered', 'Shipped', 'Delivered'];
    statusOptions.forEach(optionText => {
      const option = document.createElement('option');
      option.setAttribute('value', optionText.toLowerCase());
      option.textContent = optionText;
      statusSelect.appendChild(option);
    });
  
    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'submit');
    submitButton.textContent = 'Submit';
  
    form.appendChild(statusLabel);
    form.appendChild(statusSelect);
    form.appendChild(submitButton);
  
    formContainer.appendChild(form);
    
    populateFormFields(item, form);
    
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      const selectedStatus = statusSelect.value;
      if (!selectedStatus || selectedStatus === 'select one') {
        console.log('Please select a valid status.');
        return;
      }
  
      await updateStatus(item, selectedStatus);
    });
  }
  
  function populateFormFields(item, form) {
    const inputs = ['productid', 'category', 'quantity', 'address'];
    
    inputs.forEach(inputId => {
      const input = form.querySelector(`#${inputId}`);
      input.value = item[inputId];
    });
  }
  
  async function main() {
    const data = await fetchData();
    const filteredData = data.filter(item => item.order === 'true');
    
    if (filteredData.length === 0) {
      console.log('No products with "order": "true" found.');
      return;
    }
    
    filteredData.forEach(item => {
      createForm(item);
    });
  }
  
  main();
  