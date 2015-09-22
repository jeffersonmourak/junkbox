function Arguments(arguments, accept) {
    var openArgument = false;
    var commonValue = [];
    var insertedArguments = {};
    for (var i in arguments) {
        var argument = arguments[i];
        if ("-" == argument[0]) {
            if (openArgument !== false) {
                throw "The argument \"" + openArgument + "\" need a value";
            }
            if ("-" == argument[1]) {
                var argument = argument.replace("--", "");
                for (var j in accept) {
                    var thisArgument = accept[j];
                    if (thisArgument.name == argument) {
                        if (thisArgument.requestValue) {
                            openArgument = thisArgument.name;
                        } else {
                            insertedArguments[thisArgument.name] = true;
                        }
                    }
                }
            } else {
                var argument = argument.replace("-", "");
                if (argument.length > 1) {
                    for (var k in argument) {
                        for (var j in accept) {
                            var thisArgument = accept[j];
                            if (thisArgument.shortcut == argument[k]) {
                                if (thisArgument.requestValue) {
                                	commonValue.push(thisArgument.name);
                                } else {
                                    insertedArguments[thisArgument.name] = true;
                                }
                            }
                        }
                    }
                } else if (argument.length > 0) {
                    for (var j in accept) {
                        var thisArgument = accept[j];
                        if (thisArgument.shortcut == argument) {
                            if (thisArgument.requestValue) {
                                openArgument = thisArgument.name;
                            } else {
                                insertedArguments[thisArgument.name] = true;
                            }
                        }
                    }
                }
            }
        } else {
            if(commonValue.length > 0){
            	for(var n in commonValue){
            		insertedArguments[commonValue[n]] = argument;
            	}

            }
            else{
            	insertedArguments[openArgument] = argument;
          	 	openArgument = false;
            }
        }
    }

    for (var i in accept) {
        if (insertedArguments[accept[i].name] === undefined) {
            insertedArguments[accept[i].name] = false;
        }
    }

    return insertedArguments;
}

module.exports = {
    "arguments": Arguments,
}