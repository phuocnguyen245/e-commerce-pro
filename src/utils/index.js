function customPick(sourceObject) {
    var keysToPick = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        keysToPick[_i - 1] = arguments[_i];
    }
    var result = {};
    for (var _a = 0, keysToPick_1 = keysToPick; _a < keysToPick_1.length; _a++) {
        var key = keysToPick_1[_a];
        if (Object.prototype.hasOwnProperty.call(sourceObject, key)) {
            result[key] = sourceObject[key];
        }
    }
    return result;
}
var sourceObject = {
    name: "John",
    age: 30,
    email: "john@example.com",
    address: "123 Main St",
};
var pickedObject = customPick(sourceObject, "name", "age");
console.log(pickedObject);
