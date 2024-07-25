export default {
  dbURL: process.env.MONGO_URL || 'mongodb+srv://adi:adi1234@cluster0.9ctbtsc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  dbName : process.env.DB_NAME || 'stayDB'
}
