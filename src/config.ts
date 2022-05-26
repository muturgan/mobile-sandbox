// APPLICATION
const appPort = process.env.APP_PORT;
if (!appPort) {
   throw new Error('APP_PORT enviroment variable is not set');
}
const APP_PORT = parseInt(appPort, 10);
if (!APP_PORT) {
   throw new Error('incorrect APP_PORT value');
}


export const config = Object.freeze({
   // APPLICATION
   APP_PORT,
});