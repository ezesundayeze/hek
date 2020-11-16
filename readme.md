# HEK is an ecommerce API build with NodeJS and Express



## Features
- User account management 
    - Create
    - Update/Forgot password
    - Sign in

- Store 
    - Create a store
    ```javascript

    const form = new FormData();
    form.append("name", "Ijeoma Stores");
    form.append("address", "Abuja");
    form.append("city", "FCT");
    form.append("image", "");
    form.append("country", "Nigeria");

    fetch("http://localhost:8000/api/v1/store/create", {
    "method": "POST",
    "headers": {
        "cookie": "connect.sid=s%253AtrQPpj-RFBc-siymngpzaLjyUYCmrumW.rIAx56wtjgEax1J9IQicfmGLo9PGTYXYWFTINvnpkQ8",
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmFiZWM2N2RkNjhhZWNhMTE2YzMzZWMiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2MDUxMDk3MzF9.M_O-C_YvdnBLmbxSYnabuyGdXNf2IKgzrM4UbECLWAk",
        "content-type": "multipart/form-data; boundary=---011000010111000001101001"
    }
    })
    .then(response => {
    console.log(response);
    })
    .catch(err => {
    console.error(err);
    });
    ```
    - Update your store

    ```javascript
    const form = new FormData();
    form.append("name", "Nkem Store");

    fetch("http://localhost:8000/api/v1/store/update/ijeoma-stores", {
    "method": "PUT",
    "headers": {
        "cookie": "connect.sid=s%253AtrQPpj-RFBc-siymngpzaLjyUYCmrumW.rIAx56wtjgEax1J9IQicfmGLo9PGTYXYWFTINvnpkQ8",
        "Content-Type": "multipart/form-data",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmFiZWM2N2RkNjhhZWNhMTE2YzMzZWMiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2MDUxMDk3MzF9.M_O-C_YvdnBLmbxSYnabuyGdXNf2IKgzrM4UbECLWAk",
        "content-type": "multipart/form-data; boundary=---011000010111000001101001"
    }
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.error(err);
    });
    ```
    - find store

- Categories
    - Create categories

- Products
    - Create Products with multiple images
    - Update products
    - review/rating

- Discount via coupon
    - Create an apply coupons

- Payment integration with paystack

- Order 
    - Create order
    ```javascript
    fetch("http://localhost:8000/api/v1/order/create", {
    "method": "POST",
    "headers": {
        "cookie": "connect.sid=s%253AtrQPpj-RFBc-siymngpzaLjyUYCmrumW.rIAx56wtjgEax1J9IQicfmGLo9PGTYXYWFTINvnpkQ8",
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZmFkNjY5YjhhNTQzZDdiMTY4M2U5OTQiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE2MDUxOTk1MTV9.6sn1bRIXM-1EPeSbTtl_EmAaXWYEi-H6pSyIS8ViBAc"
    },
    "body": {
        "products": [
        {
            "id": "5fad66018a543d7b1683e991",
            "quantity": 2
        },
        {
            "id": "5fad660b8a543d7b1683e992",
            "quantity": 3
        }
        ],
        "shipping": {
        "name": "Benson Idoko",
        "address": "14 Obsanjo road, Bwari Abuja",
        "state": "Abuja",
        "country": "Nigeria",
        "postalCode": "41000023"
        },
        "coupon": "fsanmb5"
    }
    })
    .then(response => {
    console.log(response);
    })
    .catch(err => {
    console.error(err);
    });
    ```
    - find order

## Things to come

- Wallet
- Withdrawals
- Analytics

### Documentation will be out soon

