import schedule from 'node-schedule';
import Client from '../models/client.model.js';

export const startScheduledJobs = () => {
  // Verificacion de cuentas inactivas que se ejecutara cada dia
  //para pruebas ajustar a 1 minuto:'*/1 * * * *' 
  schedule.scheduleJob('0 * * * *', async () => {
    console.log('Verificando cuentas inactivas...');

    //const inactivityLimit = 1 * 60 * 1000; // 1 minuto para pruebas
    const inactivityLimit = 6 * 30 * 24 * 60 * 60 * 1000; // 6 meses
    const currentTime = Date.now();

    // Buscar usuarios que superaron el límite de inactividad y no están deshabilitados
    const inactiveUsers = await Client.find({
      lastLogin: { $lt: new Date(currentTime - inactivityLimit) },
      isEnabled: true, // Solo evalúa usuarios que no estén ya deshabilitados
    });

    for (const user of inactiveUsers) {
    user.isEnabled = false;  // Marcar como deshabilitada
      await user.save();
      console.log(`Cuenta deshabilitada por inactividad: ${user.email}`);
    }

    console.log(`${inactiveUsers.length} cuentas deshabilitadas por inactividad.`);
  });
};
export default startScheduledJobs;

