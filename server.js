'use strict';

try {
	const cluster = require('cluster');

	if (cluster.isMaster) {
		const numCPUs = require('node:os').availableParallelism();

		console.log(`Primary ${process.pid} is running...`);

		for (let i = 0; i < numCPUs; i++) {
			cluster.fork();
		}

		cluster.on('online', function (worker) {
			console.log('Worker ' + worker.process.pid + ' is online');
		});

		cluster.on('exit', function (worker, code, signal) {
			console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
			cluster.fork();
		});
	} else {
		require('./app');
	}
} catch (error) {
	console.log(error);
}
