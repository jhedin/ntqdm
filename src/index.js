'use strict'

module.exports = function(){
    
/**
 * renders progress to a string
 * @private 
 * @param {Number} n - iterations completed
 * @param {Number} total - total iterations to do
 * @param {Number} elapsed - time taken so fa in ms
 * @return {Object} ret - the combined object
 */
function _render(n, total, elapsed) {

	var cent = n/total*100;
	var est = (100 - (cent+0.000001))/(cent+0.0000001) * elapsed;
	var ips = n / ((elapsed+0.000001)/1000);
	cent = Math.floor(cent);

	var out = "|";
	for(let i = 0; i < 10; i++) {
		if(i >= Math.round(cent/10)) {
			out += "-";
		} else {
			out += "#";
		}
	}

	out += "| " + n + "/" + total + " " + cent + "% [";

	out += "elapsed: " + _formatter(elapsed) + " ";
	out += "left: " + _formatter(est) + ", ";
	out += ips.toFixed(2) + " iters/s]\n";

	return out;
}


/**
 * Formats a time in ms to HH:MM:SS, or MM:SS if the time is less than an hour
 * @private 
 * @param {Number} msec
 * @return {string} out
 */
function _formatter(msec) {

	var out = "";
	var sec = Math.floor(msec / 1000);
	var min = Math.floor(sec / 60);
	var hour = Math.floor(min / 60);
	sec = sec - min * 60;
	min = min - hour * 60;
	if(hour > 0) {
		if(hour < 10) {
			out = "0"
		}
		out = out + hour.toString() + ":";
	}
	if(min < 10) {
		out = out + "0";
	}
	out = out + min.toString() +":";
	if(sec < 10) {
		out = out + "0";
	}
	out = out + sec.toString();

	return out;
}
	

	return {
		/**
		 * Adds a timed progress bar to iterables
		 * @param {Iterable} iter
		 * @param {Object} par - The optional parameters
		 * @param {string} par.desc - A desciption string to add before the progress bar
		 * @param {Number} par.total - The number of iterations to complete, needed for infinite iterables
		 * @param {Number} par.minIter - The minimum number of iterations between progress bar updates
		 * @param {Number} par.minInterval - The minimum amount of time between progress bar updates
		 * @param {Boolean} par.logging - whether to output as a log, or update the same line
		 */
		qm: function* (iter, par) {

			var def = {
				desc:'',
				minIter: 1,
				minInterval: 500,
				logging: false
			};

			var params = {}
			if(typeof def === 'object') {
				for(let i in def) {
					params[i] = def[i];
				}
			}
			if(typeof par === 'object') {		
				for(let i in par) {
					params[i] = par[i];
				}
			}
			var start = Date.now();
			var now = start;
			var n = 0; 
			var lastn = 0;
			var elapsed;
			var lastElapsed  = 0;;

			if(!("total" in params)) {
				for (let i of iter) {
					n++;
				}
				params["total"] = n;
				n = 0;
			}

			console.log(params.desc);

			// put an initial bar out
			process.stdout.write(_render(0,params.total,0));

			// iterations
			for (let i of iter) {
				yield i;
				n++;
				elapsed = Date.now() - start;
				if(n - lastn >= params.minIter && elapsed - lastElapsed >= params.minInterval) {
					if(params.logging) {
						process.stdout.write("\u001b[1F\u001b[2K");
					}
					
					lastn = n;
					lastElapsed = elapsed;
					process.stdout.write(_render(n, params.total, elapsed));
				}
				if(n > params.total) {
					break;
				}
			}
		}
	};

}