import MockingService from "../services/mocking.js";

const getMockingPets = async (req, res) => {
    try {
        const pets = await MockingService.generateMockingPets(100); 
        res.send({status: "success", payload: pets}); 
    } catch (error) {
        console.error("Error al obtener mascotas mockeadas:", error);
        res.status(500).json({ message: "Error al obtener mascotas mockeadas" });
    }
}

const getMockingUsers = async (req, res) => {
    try {
        const users = await MockingService.generateMockingUsers(50); 
        res.send({status: "success", payload: users});
    } catch (error) {
        console.error("Error al obtener usuarios mockeados:", error);
        res.status(500).json({ message: "Error al obtener usuarios mockeados" });
    }
}

const generateData = async (req, res) => {
    try {
        const { numUsers = 5, numPets = 5 } = req.body;
        const data = await MockingService.generateData(numUsers, numPets); 
        res.send({status: "success", payload: data});
    } catch (error) {
        console.error("Error al generar datos:", error);
        res.status(500).json({ message: "Error al generar datos" });
    }
}

const getPetsBd = async (req, res) => {
    try {
        const pets = await MockingService.pet(); 
        res.send({status: "success", payload: pets}); 
    } catch (error) {
        console.error("Error al obtener mascotas de la BD:", error);
        res.status(500).json({ message: "Error al obtener mascotas de la BD" });
    }
}

const getUsersBd = async (req, res) => {
    try {
        const users = await MockingService.user(); 
        res.send({status: "success", payload: users});
    } catch (error) {
        console.error("Error al obtener usuarios de la BD:", error);
        res.status(500).json({ message: "Error al obtener usuarios de la BD" });
    }
}

export default {
    getMockingPets,
    getMockingUsers,
    generateData,
    getPetsBd,
    getUsersBd
}
