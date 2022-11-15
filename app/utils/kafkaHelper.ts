import { Kafka, RecordMetadata } from "kafkajs";
import { Context } from "@azure/functions";

/**
 * This is Kafka helper class
 */
class KafkaHelper {
  private _kafkaClient: Kafka;
  private _context: Context;

  /** KafakHelper */
  constructor(context?: Context) {
    try {
      if (context) {
        this._context = context;
      }

      //Get kafka client
      this._kafkaClient = this.getKafkaClient();
    } catch (error) {
      this.log(
        `Failed to create insteance of KafkaHelper. Reason: ${error.message}`
      );
    }
  }

  /**
   * This is helper to log kafka steps
   * @param args
   */
  private log(...args: any[]) {
    if (this._context) {
      this._context.log("kafkkHelper::", ...args);
    }
  }

  /**
   * get kafka client based config values
   * @returns Kafka
   */
  private getKafkaClient(): Kafka {
    return new Kafka({
      clientId: "azure-functions-contributionindex-app",
      brokers: [process.env.contribution_KafkaBroker],
      ssl: process.env.contribution_KafkaSSL === "true",
      sasl: {
        mechanism: "plain",
        username: process.env.contribution_kafkaUser,
        password: process.env.contribution_KafkaPass,
      },
    });
  }

  /**
   * This is Kafka producing. Send message to given topic and payload
   * @param topic
   * @param payload
   */
  async sendMessageToTopic(topic: string, payload: any) {
    try {
      //Step1: Check kafka client available or not
      if (!this._kafkaClient) {
        this._kafkaClient = this.getKafkaClient();
      }

      //Step2: Get producer and try to connect..
      const producer = this._kafkaClient.producer();
      await producer.connect();
      this.log("Producer is connected");

      //Step3: Send message to topic
      this.log(
        `Send message to ${topic}`,
        `payload: ${JSON.stringify(payload)}`
      );
      const result: RecordMetadata[] = await producer.send({
        topic: topic,
        messages: [{ ...payload }],
      });
      this.log(`Message is sent successfully: ${result}`);
      await producer.disconnect();
    } catch (error) {
      this.log(
        `Failed to send message to topic: ${topic} & payload: ${JSON.stringify(
          payload
        )}. Reason: ${error.message}`
      );
    }
  }
}

export default KafkaHelper;
