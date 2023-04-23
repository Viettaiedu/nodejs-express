const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
const payment = async (req, res) => {
  const total_amount = 100000;
  const shipping = 10000;
  const calculateTotal = () => total_amount + shipping;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateTotal(),
    currency: "VND",
    description: "give me a money",
  });
  res.json({ paymentIntent });
};
module.exports = payment;
