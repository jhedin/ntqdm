# ntqdm

tqdm for node

wrap an iterable in tdqm, and it will update the progress bar as it iterates

install

npm install ntqdm


usage:

```javascript
var tdqm = require(ntqdm)();

var t = [1,2,3,4,5,6,7,8,9,10];
for(let i of tdqm(t)) {
	sleep(1000);
}
```


for infinite iterables, you need to specify a total number of iteations to complete. If no total is specified, tdqm tries to find the total by iterating.

```javascript
for(let i of tdqm(generator(), {total:50})) {
	sleep(1000);
}
```

normally, tdqm updates the same line, and assumes nothing else is written to stdout, you can set logging to true to output on new lines

```javascript
for(let i of tdqm(generator(), {total:50, logging:true})) {
	sleep(1000);
	console.log("foo");
}
```

other switches:

desc - text to add above the progress bar  
minIter - the minimum number of iterations to complete between updates
minInterval - the amount of time between iterations


