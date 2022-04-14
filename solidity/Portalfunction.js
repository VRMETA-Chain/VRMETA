async function processPortalHash() {
	const api = await ApiPromise.create({ provider });
  const keyring = new Keyring({ type: 'sr25519' });
  const alice =  keyring.addFromUri('//Alice');
 await api.tx.chainless.hashEmitted( 1000, "0x32")
  .signAndSend(alice, (result) => {
     if (result.isInBlock) {
     
        console.log('Events:');
        result.events.forEach(({ event: { data, method, section }, phase }) => {
    
          console.log('\t', phase.toString(), `: ${section}.${method}`, data[0].toString());
         
          const hash = data[0].toString();
         // currentHash.push(hash);
          console.log(hash);
        });
      }else if (result.status.isFinalized) {
      console.log('finalized');
      

    }
  });
