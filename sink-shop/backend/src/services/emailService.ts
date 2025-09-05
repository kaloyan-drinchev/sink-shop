import nodemailer from "nodemailer";
import { config } from "../config/config.js";

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    title: string;
    serialNumber: string;
    productId: string;
    quantity: number;
    price: number;
    currency: string;
  }>;
  totalEur: number;
  totalBgn: number;
  orderDate: Date;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
    });
  }

  private formatOrderEmail(data: OrderEmailData): string {
    const formattedItems = data.items
      .map(
        (item) =>
          `• ${item.title} (Serial: ${item.serialNumber})
    Link: ${config.FRONTEND_URL}/sink/${item.productId}
    Quantity: ${item.quantity} - Price: ${item.price.toFixed(2)} ${item.currency}`
      )
      .join("\n\n");

    return `
New Order Received - ${data.orderNumber}

Customer Information:
- Name: ${data.customerName}
- Email: ${data.customerEmail}
- Phone: ${data.customerPhone}

Shipping Address:
${data.shippingAddress.address}
${data.shippingAddress.city}, ${data.shippingAddress.postalCode}
${data.shippingAddress.country}

Order Items:
${formattedItems}

Order Total:
€${data.totalEur.toFixed(2)} EUR / ${data.totalBgn.toFixed(2)} BGN

Order Date: ${data.orderDate.toLocaleString()}
Order Number: ${data.orderNumber}

---
Sink Shop Order System
    `;
  }

  async sendOrderNotification(orderData: OrderEmailData): Promise<boolean> {
    try {
      const mailOptions = {
        from: config.EMAIL_USER,
        to: "kalloyand@gmail.com",
        subject: `New Order - ${orderData.orderNumber}`,
        text: this.formatOrderEmail(orderData),
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Order notification email sent:", info.messageId);
      return true;
    } catch (error) {
      console.error("Failed to send order notification email:", error);
      return false;
    }
  }

  async sendCustomerConfirmation(orderData: OrderEmailData): Promise<boolean> {
    try {
      const mailOptions = {
        from: config.EMAIL_USER,
        to: orderData.customerEmail,
        subject: `Order Confirmation - ${orderData.orderNumber}`,
        text: `
Dear ${orderData.customerName},

Thank you for your order! Here are the details:

Order Number: ${orderData.orderNumber}
Order Date: ${orderData.orderDate.toLocaleString()}

Items Ordered:
${orderData.items
  .map(
    (item) =>
      `• ${item.title} (Serial: ${item.serialNumber})
  Link: ${config.FRONTEND_URL}/sink/${item.productId}
  Quantity: ${item.quantity} - ${item.price.toFixed(2)} ${item.currency}`
  )
  .join("\n\n")}

Total: €${orderData.totalEur.toFixed(2)} EUR / ${orderData.totalBgn.toFixed(2)} BGN

Shipping Address:
${orderData.shippingAddress.address}
${orderData.shippingAddress.city}, ${orderData.shippingAddress.postalCode}
${orderData.shippingAddress.country}

We will process your order and contact you with shipping details soon.

Thank you for choosing Sink Shop!

Best regards,
Sink Shop Team
        `,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log("Customer confirmation email sent:", info.messageId);
      return true;
    } catch (error) {
      console.error("Failed to send customer confirmation email:", error);
      return false;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log("Email service is ready");
      return true;
    } catch (error) {
      console.error("Email service connection failed:", error);
      return false;
    }
  }
}

export { EmailService };
export const emailService = new EmailService();
