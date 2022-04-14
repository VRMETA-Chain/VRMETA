async function processPortalHash() {
	const api = await ApiPromise.create({ provider });
  const keyring = new Keyring({ type: 'sr25519' });
  const alice =  keyring.addFromUri('//Alice');
  const eventArr = [];
 await api.tx.chainless.hashEmitted( 1000, "0x32")
  .signAndSend(alice, (result) => {
   
     if (result.isInBlock) {
        console.log('Events:');
        result.events.forEach(({ event, phase }) => {
  
         eventArr.push(event.data[0].toString());
        });
      }else if (result.status.isFinalized) {
      console.log(eventArr[0]);
      io.emit('processes hash', eventArr[0]);

    }
  });
	
}
