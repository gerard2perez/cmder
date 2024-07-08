import parse from 'lcov-parse';
const rest = (await new Promise((resolve) => parse('./coverage/lcov.info', function (err, data) {
    resolve(data);
})));
console.log(rest.at(0).lines);
