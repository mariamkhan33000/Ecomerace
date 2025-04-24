import mongoose from 'mongoose'

const connectedDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database is connected at ${mongoose.connection.host} Successfully . . . . . `)
    } catch (error) {
        console.log(`Database is not Connected error : ${error}`)
    }
}

export default connectedDb;