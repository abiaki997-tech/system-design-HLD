// const { Kafka } = require("kafkajs");

// const kafka = new Kafka({
//   brokers: ["localhost:9092"],
// });

// const consumer = kafka.consumer({ groupId: "test-group" });

// const run = async () => {
//   await consumer.connect();
//   await consumer.subscribe({ topic: "test-topic", fromBeginning: true });

//   await consumer.run({
//     eachMessage: async ({ message }) => {
//       console.log({
//         value: message.value.toString(),
//       });
//     },
//   });
// };

// run().catch(console.error);

// consumer.js
const { Kafka } = require("kafkajs");

const kafka = new Kafka({ clientId: "service-b", brokers: ["localhost:9092"] });
const consumer = kafka.consumer({ groupId: "order-processor" });

const run = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "processed-orders", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`📩 Service B got: ${message.value.toString()}`);
    },
  });
};

run().catch(console.error);
