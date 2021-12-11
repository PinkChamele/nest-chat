export default () => ({
  port: parseInt(process.env.SERVER_PORT, 10) || 3000,
  host: process.env.HOST_NAME,
  database: {
    password: process.env.MONGODB_PASSWORD,
    name: process.env.DATABASE_NAME,
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  session: {
    secret: process.env.SESSION_SECRET,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL,
    username: process.env.SENDFRID_USERNAME,
    port: parseInt(process.env.SENDGRID_PORT, 10),
    host: process.env.SENDGRID_HOST,
  },
});
