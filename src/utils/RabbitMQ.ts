import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

export const rabbitSend = async (queue: string, routeKey: string, data: any) => {
  const channel = (await (await amqp.connect(process.env.AMQP_URL)).createChannel());
  
  await channel.assertExchange("DirectExchange", 'direct', { durable: true });
  await channel.assertQueue(queue, { durable: true });
  await channel.bindQueue(queue, "DirectExchange", routeKey);
  
  channel.publish("DirectExchange", routeKey, Buffer.from(JSON.stringify(data)));
};