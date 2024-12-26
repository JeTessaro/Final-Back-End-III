import mongoose from "mongoose";
import assert from "assert";
import User from "../src/dao/Users.dao.js";

const connection = mongoose.connect(`mongodb+srv://hemy1605:101Dalmatas@cluster0.pxtmf5z.mongodb.net/c70090?retryWrites=true&w=majority&appName=Cluster0`);

describe('Testeamos el DAO de usuarios', function() {

    beforeEach(async function () {
        this.usersDao = new User();
        // Limpiar los documentos de la colección de usuarios antes de cada prueba
        await mongoose.connection.collections.users.deleteMany({});
        this.timeout(5000);
    });

    it("El get de usuarios me debe retornar un array", async function () {
        const resultado = await this.usersDao.get();
        assert.strictEqual(Array.isArray(resultado), true);
    });

    // Test 1
    it("El DAO debe poder agregar un usuario nuevo en la base de Datos", async function () {
        let usuario = {
            first_name: "Mirtha",
            last_name: "Martinez",
            email: "tengo1000años@gmail.com",
            password: "1234"
        };   
        
        const resultado = await this.usersDao.save(usuario);
        assert.ok(resultado._id);
    });

    // Test 2
    it("Validamos que el usuario tenga un array de mascotas vacío", async function () {
        let usuario = {
            first_name: "Mirtha",
            last_name: "Martinez",
            email: "tengo1000años@gmail.com",
            password: "1234"
        };   
        
        const resultado = await this.usersDao.save(usuario);
        assert.deepStrictEqual(resultado.pets, []);
    });

    // Test 3
    it("El DAO puede obtener un usuario por email", async function () {
        let usuario = {
            first_name: "Lia",
            last_name: "Crucet",
            email: "liainmortal@gmail.com",
            password: "1234"
        };   
        
        await this.usersDao.save(usuario);

        const user = await this.usersDao.getBy({email: usuario.email});
        assert.deepStrictEqual(typeof user, "object");
    });

    after(async function () {
        await mongoose.disconnect();        
    });
});

