/* eslint-disable prettier/prettier */
import { WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() 
    server: Server;

    //Mapa para almacenar los UID de Firebase  y los usuarios correspondientes
    private clients = new Map<string, Socket>();

    handleConnection(client: Socket) {
        // Aquí asumimos que el UID de Firebase se envía como una cadena de consulta
        let firebaseUID = client.handshake.query.firebaseUID;

        // Si firebaseUID es un arreglo, tomamos el primer elemento
        if (Array.isArray(firebaseUID)) {
            firebaseUID = firebaseUID[0];
        }
        console.log('Client connected: ' + firebaseUID);
        // Almacenamos el cliente en el mapa con su UID de Firebase
        this.clients.set(firebaseUID, client);
    }

    handleDisconnect(client: Socket) {
        // Encuentra el UID de Firebase correspondiente al cliente desconectado
        const firebaseUID = [...this.clients.entries()]
            .find(([, socket]) => socket === client)?.[0];
        console.log('Client disconnected: ' + firebaseUID);

        // Elimina el cliente del mapa
        this.clients.delete(firebaseUID);
    }

    @SubscribeMessage('mensaje')
    handleMessage(client: Socket, data: any) {
        console.log(data);

        // Supongamos que 'data' es un objeto con la estructura { to: firebaseUID, message: mensaje }
        const receiverSocket = this.clients.get(data.to);
        if (receiverSocket) {
            // Emitir el mensaje al cliente destinatario
            receiverSocket.emit('mensajePrivado', data.message);
        }
    }

}