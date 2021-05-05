var assert = require('assert');
var tdqm = require('../');

describe('tqdm', function() {
  it('prints a progress bar, for long running for..of loops', function(done) {
    
    function sleep( sleepDuration ){
	var now = new Date().getTime();
	while(new Date().getTime() < now + sleepDuration){ /* do nothing */ } 
	}

	var t = [1,2,3,4,5,6,7,8,9,10];
	for(var i of tdqm(t)) {
		sleep(100);
	}

    done();
  });
});
