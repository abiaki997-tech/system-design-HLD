# kafka

1.  setup zookeeper/raft (completed)
2.  set producer and consumer (completed)
3.  java stream and stream in kafkajs (completed)
4.  kafka connect use sink (kafka topic => db) (pending)
5.  kafka connect use source debezium / cdc / jdbc source (db => kafka) (pending)
6.  Strimzi Operator with KafkaTopic CRDs. - topic,partion,replica manage (pending)
    -Topics are declared as config and managed by ops/devops. Custom Resources (CRDs)
    If Kafka is running in Kubernetes, Strimzi Operator is the best choice since it manages the full lifecycle (brokers, topics, users) with CRDs
7.  CDC (pending)
    How CDC works (Source DB → Kafka)

    1. Debezium Connector (source) is deployed in Kafka Connect.

       It connects to the database (via binlogs in MySQL/Postgres WAL/CDC streams, etc).

       Captures changes: INSERT, UPDATE, DELETE.

       Converts them into Kafka messages (events).

    2. Kafka Topic stores those events.

       For example: dbserver1.inventory.customers topic.

    3. Downstream apps/services consume from Kafka.

       Microservices, Kafka Streams, Flink, ksqlDB, or sink connectors (e.g., to Elasticsearch, MongoDB, another DB).

8.  CDC + CQRS (Command Query Responsibility Segregation) (pending)
    Write model (commands) → update DB

    Read model (queries) → optimized for fast reads, maybe in another DB (ElasticSearch, MongoDB, etc.)

    Example:
    Order Service → writes to MySQL (orders table).

         CDC captures new orders → sends to Kafka topic (orders-events).

         Query Service consumes this topic → updates ElasticSearch.

         Now queries hit ElasticSearch instead of MySQL.

9.  CDC + Saga Pattern (pending)

    CDC can trigger Saga workflows:

    A change in one DB (via CDC) → published to Kafka → Saga orchestrator/choreography picks it up → triggers next step.

    👉 Example:

    Payment Service writes a row in DB: payment_status = PENDING.

    CDC captures this row change → publishes to Kafka (payment-events).

    Order Service consumes event → updates order status.

    If Payment fails → another CDC event (payment_status = FAILED) triggers compensating action in Order Service.

    So CDC can act as the event source for Sagas.

    ```
    🔹 When to Use Where

    Use CDC in CQRS → to replicate write DB → read DB for real-time sync.

    Use CDC in Saga → when you want DB state changes to automatically emit events to coordinate distributed transactions.

    ```

10. OutBox Pattern:

    Solution (Outbox Pattern):

    Inside the same DB transaction, you write the business data + an "outbox" event record.

    Later, a process (or Kafka Connect/Debezium) reads the "outbox" table and reliably publishes the event to Kafka.

    Outbox Pattern uses CDC as an implementation detail.

    Outbox ensures atomicity (no dual-write problem).

    CDC reads the outbox table → publishes event to Kafka.

    CDC (Change Data Capture)

    CDC is a technique: capture every change (INSERT/UPDATE/DELETE) in a database (often using the transaction log).

    Debezium is a popular CDC tool.

    CDC can:

    Replicate data from DB → Kafka (for analytics, CQRS).

    Read an outbox table and publish events reliably → this is where it meets the Outbox Pattern.

    ```
    db change (cdc) -> kafka topic -> subscribed materialized view/elasticsearch
    ```

11. saga:
    Startups / simple apps → Choreography (faster, fewer moving parts).

    Enterprises / regulated industries → Orchestration with workflow engines like:

    Temporal.io (very popular now, Uber, Datadog, Stripe use it)

    Camunda (banks, insurance)

    Netflix Conductor (media, streaming workflows)

    Zeebe (used in distributed orchestration)

    👉 Two types:

    Choreography (event-driven):

    Services communicate via events (Kafka, RabbitMQ).

    No central coordinator.

    Simple, but can get complex when many services are involved.

    Example:

    Order Service → “OrderCreated” event → Payment Service → “PaymentProcessed” event → Inventory Service, etc.

    If payment fails → emit “PaymentFailed” → Order cancels itself.

    Orchestration (central coordinator):

    A Saga orchestrator service tells each service what to do.

    Easier to manage, but introduces a single point of control.
