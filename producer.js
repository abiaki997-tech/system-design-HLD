// const { Kafka } = require("kafkajs");

// const kafka = new Kafka({
//   brokers: ["localhost:9092"],
// });

// const producer = kafka.producer();

// const sendMessage = async () => {
//   await producer.connect();
//   setInterval(async () => {
//     await producer.send({
//       topic: "test-topic",
//       messages: [{ value: `Message ${Date.now()}` }],
//     });
//     console.log("Message sent");
//   }, 2000);
// };

// sendMessage().catch(console.error);

// producer.js
const { Kafka } = require("kafkajs");

const kafka = new Kafka({ clientId: "service-a", brokers: ["localhost:9092"] });
const producer = kafka.producer();

const run = async () => {
  await producer.connect();
  await producer.send({
    topic: "orders",
    messages: [
      {
        key: "order1",
        value: JSON.stringify({ id: 1, product: "Book", qty: 2 }),
      },
    ],
  });
  console.log("✅ Order sent");
  await producer.disconnect();
};

run().catch(console.error);
