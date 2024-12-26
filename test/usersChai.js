import mongoose from "mongoose"
import chai     from "chai"
import User     from "../src/dao/Users.dao.js"

const expect = chai.expect

const connection = mongoose.connect(`mongodb+srv://hemy1605:101Dalmatas@cluster0.pxtmf5z.mongodb.net/c70090?retryWrites=true&w=majority&appName=Cluster0`)

describe('Tesateamos el DAO de usuarios', function() {

    beforeEach (function () {
        this.usersDao = new User()
    })

    beforeEach(async function () {
        await mongoose.connection.collections.users.drop()
        this.timeout(5000)        
    })

    it("El get de usuaros me debe retornar un array", async function () {
        const resultado = await this.usersDao.get()
        expect(Array.isArray(resultado)).to.be.true
    })

    //Test 1

    it("El DAO debe poder agregar un ususario nuevo en la base de Datos", async function () {
        let usuario = {
            first_name: "Mirtha",
            last_name: "Martinez",
            email: "tengo1000años@gmail.com",
            password: "1234"
        }   
        
        const resultado = await this.usersDao.save(usuario)
        expect(resultado).to.have.property("_id")
    })

    //Test 2

    it("Validamos que el usuario tenga un array de mascotas vacio", async function () {
        let usuario = {
            first_name: "Mirtha",
            last_name: "Martinez",
            email: "tengo1000años@gmail.com",
            password: "1234"
        }   
        
        const resultado = await this.usersDao.save(usuario)
        expect(resultado.pets).to.deep.equal([])
    })

    //Test 3

    it("El DAO puede obtener un usuario por email", async function () {
        let usuario = {
            first_name: "Lia",
            last_name: "Crucet",
            email: "liainmortal@gmail.com",
            password: "1234"
        }   
        
        await this.usersDao.save(usuario)

        const user = await this.usersDao.getBy({email: usuario.email})
       expect(user).to.be.an("object")
    })

    after(async function () {
        await mongoose.disconnect()        
    })


})
