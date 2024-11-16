const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('./User'); // Importa tu modelo

let mongoServer;

beforeAll(async () => {
  // Inicia un servidor MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Conecta Mongoose al servidor en memoria
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  // Desconecta Mongoose y detiene el servidor
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  // Limpia las colecciones después de cada prueba
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

describe('User Model Tests', () => {
  it('Debe crear un usuario correctamente', async () => {
    const userData = { nombre: 'Juan', email: 'juan@example.com', password: 'securepassword' };
    const user = new User(userData);
    const savedUser = await user.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.nombre).toBe(userData.nombre);
    expect(savedUser.email).toBe(userData.email);
  });

  it('Debe fallar al intentar crear un usuario con un email duplicado', async () => {
    const userData = { nombre: 'Juan', email: 'juan@example.com', password: 'securepassword' };
    await new User(userData).save();

    const duplicateUser = new User(userData);
    await expect(duplicateUser.save()).rejects.toThrow(/duplicate key/);
  });

  it('Debe fallar si no se proporciona un email', async () => {
    const userData = { nombre: 'Juan', password: 'securepassword' };
    const user = new User(userData);

    await expect(user.save()).rejects.toThrow(/email/);
  });

  it('Debe permitir guardar usuarios con el mismo nombre pero diferente email', async () => {
    const userData1 = { nombre: 'Juan', email: 'juan1@example.com', password: 'securepassword' };
    const userData2 = { nombre: 'Juan', email: 'juan2@example.com', password: 'securepassword' };

    const user1 = new User(userData1);
    const user2 = new User(userData2);

    await expect(user1.save()).resolves.toBeDefined();
    await expect(user2.save()).resolves.toBeDefined();
  });
});
