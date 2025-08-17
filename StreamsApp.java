// import org.apache.kafka.streams.*;
// import org.apache.kafka.streams.kstream.*;

// public class StreamsApp {
// public static void main(String[] args) {
// StreamsBuilder builder = new StreamsBuilder();

// // Read from 'orders' topic (Node.js producer)
// KStream<String, String> orders = builder.stream("orders");

// // Process data: Filter high-value orders (> $50)
// orders.filter((key, value) -> {
// double amount =
// Double.parseDouble(value.split("\"amount\":")[1].split("}")[0]);
// return amount > 50;
// }).to("high-value-orders"); // Write to new topic

// // Start the stream
// KafkaStreams streams = new KafkaStreams(
// builder.build(),
// new StreamsConfig(Map.of(
// StreamsConfig.APPLICATION_ID_CONFIG, "orders-streams-app",
// StreamsConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:9092"
// ))
// );
// streams.start();
// }
// }