const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();

bands.addBand( new Band( 'Imagine Dragons' ) );
bands.addBand( new Band( 'Coldplay' ) );
bands.addBand( new Band( 'Simple Plan' ) );
bands.addBand( new Band( 'Green Day' ) );
bands.addBand( new Band( 'Gorrillaz' ) );

// Mensajes de Sockets
io.on('connection', client => {
    console.log('Nuevo cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => { 
        console.log('Cliente desconectado');
    });

    client.on('mensaje', ( payload ) => {
        io.emit('mensaje', { admin: 'Nuevo mensaje' });
    });

    client.on('vote-band', ( payload ) => {
        bands.voteBand( payload.id );

        io.emit('active-bands', bands.getBands()); 
    });

    client.on('add-band', ( payload ) => {
        const newBand = new Band( payload.name );
        bands.addBand( newBand );

        io.emit('active-bands', bands.getBands()); 
    });

    client.on('delete-band', ( payload ) => {
        bands.deleteBand( payload.id );

        io.emit('active-bands', bands.getBands()); 
    });

    // client.on('emitir-mensaje', (payload) => {
    //     //io.emit('nuevo-mensaje', payload); // Emite a todos
    //     client.broadcast.emit('nuevo-mensaje', payload); // emite a todos menos el que lo emitio
    // });
});