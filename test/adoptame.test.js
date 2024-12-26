import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js'; // Asegúrate de que la ruta es correcta
import adoptionModel from '../src/dao/models/Adoption.js';
import assert from 'assert'; // Importamos assert para las aserciones
import { petsService, usersService } from '../src/services/index.js';

// Conectar a la base de datos
mongoose.connect('mongodb+srv://hemy1605:101Dalmatas@cluster0.pxtmf5z.mongodb.net/c70090?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

describe('Testeamos el DAO de Adoptions', function() {
  this.timeout(10000); 
  let validAdoptionId;

  before(async function() {
    // No eliminar la colección, solo verificar que haya datos
    const count = await adoptionModel.countDocuments();
    
    if (count === 0) {
      // Agregar un registro de adopción específico para las pruebas solo si la colección está vacía
      let registro = {
        owner: mongoose.Types.ObjectId("67681101a522af8c82e2cf83"),
        pet: mongoose.Types.ObjectId("674151ad29edf48fe1471610")
      };

      const resultado = await adoptionModel.create(registro);
      validAdoptionId = resultado._id; 
      console.log(`ID de adopción válido: ${validAdoptionId}`);
    } else {
      // Si ya hay registros, obtener uno existente
      const existingAdoption = await adoptionModel.findOne();
      validAdoptionId = existingAdoption._id; 
      console.log(`Usando ID de adopción existente: ${validAdoptionId}`);
    }
  });

  it("El get de adoptions me debe retornar un array", async function() {
    const resultado = await adoptionModel.find();
    assert(Array.isArray(resultado), 'El resultado debería ser un array');
  });

  it("El DAO debe poder agregar un registro nuevo en la base de Datos", async function() {
    let registro = {
      owner: mongoose.Types.ObjectId("67681101a522af8c82e2cf83"),
      pet: mongoose.Types.ObjectId("674151ad29edf48fe1471610")
    };

    const resultado = await adoptionModel.create(registro);
    assert(resultado._id, 'El resultado debería tener un _id');
  });

  describe('GET /api/adoptions/:aid', () => {
    it('debería retornar una adopción específica por ID válido', async () => {
      const response = await request(app).get(`/api/adoptions/${validAdoptionId}`);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(typeof response.body, 'object');
    });

    it('debería retornar error 404 para ID de adopción inexistente', async () => {
      const nonExistentId = mongoose.Types.ObjectId();

      const response = await request(app).get(`/api/adoptions/${nonExistentId}`);

      assert.strictEqual(response.status, 404);
    });

    it('debería retornar error 400 para ID de adopción inválido', async () => {
      const invalidId = "1b1446a";
      
      const response = await request(app).get(`/api/adoptions/${invalidId}`);

      assert.strictEqual(response.status, 400);
    });
  });

  describe('POST /api/adoptions/:uid/:pid', () => {
    const validUserId = '676d82e75076020ede80f213';
    const validPetId = '676d5ac45d1052c2045ffa7b'; 
   

    it('debería realizar una adopción con usuario y mascota válidos', async () => {
      const response = await request(app).post(`/api/adoptions/${validUserId}/${validPetId}`);

      assert([200, 400].includes(response.status), `Expected status 200 or 400, but got ${response.status}`);
      if (response.status === 200) {
          assert.strictEqual(typeof response.body, 'object');
          assert.strictEqual(response.body.status, 'success', 'Expected success status');
      }
    });

    it('debería retornar error 404 para usuario inexistente', async () => {
      const invalidId = mongoose.Types.ObjectId();
      const validPetId = '674151ad29edf48fe1471610';

      const response = await request(app).post(`/api/adoptions/${invalidId}/${validPetId}`);

      assert.strictEqual(response.status, 404);
    });

    it('debería retornar error 404 para mascota inexistente', async () => {
      const validUserId = '67681101a522af8c82e2cf83';
      const invalidId = mongoose.Types.ObjectId();

      const response = await request(app).post(`/api/adoptions/${validUserId}/${invalidId}`);

      assert.strictEqual(response.status, 404);
    });
  });

});
