// stream-app.js
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "stream-app",
  brokers: ["localhost:9092"],
});
const consumer = kafka.consumer({ groupId: "stream-group" });
const producer = kafka.producer();

const run = async () => {
  await consumer.connect();
  await producer.connect();

  await consumer.subscribe({ topic: "orders", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(message.value.toString());

      // simple transformation
      const enrichedOrder = {
        ...order,
        status: "PROCESSED",
        timestamp: new Date().toISOString(),
      };

      // write to new topic
      await producer.send({
        topic: "processed-orders",
        messages: [
          { key: order.id.toString(), value: JSON.stringify(enrichedOrder) },
        ],
      });

      console.log("🔄 Transformed and forwarded:", enrichedOrder);
    },
  });
};

run().catch(console.error);
