import { faker } from '@faker-js/faker';
import User from '../dao/models/User.js'; 
import Pet from '../dao/models/Pet.js';  
import { createHash } from '../utils/index.js'; 

class MockingService {

    static async generateMockingPets(num) {
        const pets = []; 

        for (let i = 0; i < num; i++) {
            pets.push({
                name: faker.animal.dog(),
                specie: faker.animal.type(),
                adopted: false
            });
        }
        return pets; 
    }

    static async generateMockingUsers(num) {
        const users = []; 
        for(let i = 0; i < num; i++) {
            users.push({
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(), 
                password: await createHash("coder123"), 
                role: faker.helpers.arrayElement(["user", "admin"]),
                pets: []
            });
        }
        return users; 
    }

    static async generateData(numUsers, numPets) {
        const users = await this.generateMockingUsers(numUsers);
        const pets = await this.generateMockingPets(numPets);

        for (let i = 0; i < Math.max(numUsers, numPets); i++) {
            const user = new User(users[i % numUsers]); 
            const pet = new Pet(pets[i % numPets]); 
            
            user.pets.push(pet._id); 
            await pet.save();
            await user.save();
        }

        return { users, pets };
    }

    static async pet() {
        const pets = await Pet.find({});
        return pets; 
    }

    static async user() {
        const users = await User.find({});
        return users; 
    }
}

export default MockingService;
