import axios from "axios";

const plans = [
  { name: "Basic", price: 499, priceId: "price_123" },
  { name: "Pro", price: 999, priceId: "price_456" },
];

export default function Plans() {
  const subscribe = async (priceId) => {
    const res = await axios.post("/api/stripe/checkout", { priceId });
    window.location.href = res.data.url;
  };

  return (
    <div>
      <h2>Choose a Plan</h2>
      {plans.map((p) => (
        <div key={p.name}>
          <h3>{p.name}</h3>
          <p>₹{p.price}/month</p>
          <button onClick={() => subscribe(p.priceId)}>Subscribe</button>
        </div>
      ))}
    </div>
  );
}
