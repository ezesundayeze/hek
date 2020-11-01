const seeder = require("mongoose-seed");
const { development, test } = require("./config");
const db = development.database_url;
const { join } = require("path");
const RandomCode = require("./randomCodeGen");

seeder.connect(db, () => {
  seeder.loadModels([join(__dirname, "../models/index.js")]);
  //   seeder.clearModels(["Transaction", "User"]);
  seeder.populateModels(data, (err, done) => {
    if (err) {
      console.error("seeder error", err);
    }
    if (done) {
      console.log("seeding completed", done);
    }

    seeder.disconnect();
  });
});

const data = [
  {
    model: "Dispute",
    documents: [
      {
        author: "5f64f8c26018581f5094cc2a",
        merchant: "5f64f8c26018581f5094cc2a",
        buyer: "5f64f8c26018581f5094cc2c",
        title: "Product does not meet criterial for acceptance",
        complain:
          "On openning the product I saw something completely different from what I ordered.",
        transactionId: "5f64f8c26018581f5094cc65",
      },
    ],
  },
  {
    model: "User",
    documents: [
      {
        email: `${RandomCode(36, 15)}@gmail.com`,
        password: "Goldmember12?",
        firstName: "John",
        lastName: "Joseph",
        phone: "08067005754",
        status: "active",
        role: "buyer",
      },
    ],
  },

  {
    model: "Transaction",
    documents: [
      {
        merchant: "5f64f8c26018581f5094cc2a",
        buyer: "5f64f8c26018581f5094cc2f",
        terms: {
          title: "Color Screen Smart Bracelet D13 Waterproof Bracelet",
          description: `If you think ourproducts are useful, please introduceyour friends to buy them
            Your 5-StarPositive Feedback is much appreciated!
            Welcome to Shopping Here!"
            How to Charge Remove the bands off the tracker host and you can see the built-in USB plug with metal pins, insert the USB plug into a USB charger(such as phone charger) for charging, no charging cable needed`,
          image: "image.jpg",
          criteriaForAcceptance:
            "It should be size 25, blue and orange color, has a clock and alarm",
          returnPolicy:
            "Return is only accepted if product doesn't meet the criterial for acceptance",
          totalAmount: "45000",
        },
      },
    ],
  },
];
