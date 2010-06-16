/*
    CanvasScript3
    Copyright (c) 2010 ARAKI Hayato
    
    MIT License
    
    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:
    
    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.
*/
var Package;
var Class;
(function()
{
    var currentNamespace = window;
    
    Package = function(packageName, packageCode)
    {
        if (currentNamespace !== window) {
            //currently inside a package
            throw new Error("Packages cannot be nested.");
        }
        
        if (arguments.length == 2) {
            //namespace and packageCode was passed
            var paths = packageName.split('.');
            var base = currentNamespace;
            for (var i = 0, l = paths.length; i < l; ++i)
            {
                var path = paths[i];
                if (base[path] === undefined) {
                    base[path] = {};
                }
                else if (!(base[path] instanceof Object)) {
                    throw new Error("Package '" + packageName + "' is not available");
                }
                base = base[path];
            }
            
            currentNamespace = base;
        }
        else if (arguments.length == 1) {
            //only the packageCode was passed
            //use the global namespace
            packageCode = packageName;
        }
        else {
            return;
        }
        
        //run the user code
        packageCode.call(currentNamespace);
        
        //reset the current namespace to global
        currentNamespace = window;
    };

    Class = function(className, classObject)
    {
        if (currentNamespace[className] !== undefined) {
            throw new Error('Duplicate definition: ' + className + '.');
        }
        
        extendClass(Object, className, classObject);
        
        return {
            Extends: function(superClass, classObject)
            {
                extendClass(superClass, className, classObject);
            }
        };
    };
    
    var extendClass = function(superClass, className, classObject)
    {
        //normalize the classObject
        if (classObject === undefined) {
            classObject = {};
        }
        else if (typeof(classObject) === 'function') {
            classObject = new classObject();
        }
        
        if (classObject[className] === undefined) {
            classObject[className] = function(){};
        }
        
        //create the subClass constructor
        var subClass = classObject[className];
        
        //extend the superClass
        var superCopy = function(){};
        superCopy.prototype = superClass.prototype;
        subClass.prototype = new superCopy();
        subClass.prototype.constructor = subClass;
        
        //add a reference to the superClass
        //TODO: not sure if this is good enough
        //UPDATE: this didn't work.
        //subClass.prototype.__super__ = superClass.prototype;
        
        
        //set the default toString methods
        subClass.toString = function()
        {
            return '[class ' + className + ']';
        };
        
        subClass.prototype.toString = function()
        {
            return '[object ' + className + ']';
        };
        
        //copy the properties from the classObject
        //to the subClass constructor
        var preffix, accessorName, accessorMethod;
        for (var property in classObject)
        {
            if (property == className) {
                //do not copy the constructor
                continue;
            }
            
            preffix = property.substr(0, 7);
            
            //Getters
            if (preffix == '__get__') {
                //define getters
                accessorName = property.substr(7);
                if (subClass.prototype.__defineGetter__) {
                    subClass.prototype.__defineGetter__(accessorName, classObject[property]);
                }
                
                //also copy as a public method for IE
                //eg: obj.__get__methodName will become obj.getMethodName()
                accessorMethod = 'get' + accessorName.charAt(0).toUpperCase() + accessorName.slice(1);
                if (!subClass.hasOwnProperty(accessorMethod)) {
                    //do not override if a method or property with the same name exists
                    subClass.prototype[accessorMethod] = classObject[property];
                }
            }
            
            //Setters
            else if (preffix == '__set__') {
                //define setters
                accessorName = property.substr(7);
                if (subClass.prototype.__defineSetter__) {
                    subClass.prototype.__defineSetter__(accessorName, classObject[property]);
                }
                
                //also copy as a public method for IE
                //eg: obj.__set__methodName will become obj.setMethodName()
                accessorMethod = 'set' + accessorName.charAt(0).toUpperCase() + accessorName.slice(1);
                if (!subClass.hasOwnProperty(accessorMethod)) {
                    //do not override if a method or property with the same name exists
                    subClass.prototype[accessorMethod] = classObject[property];
                }
            }
            
            subClass.prototype[property] = classObject[property];
        }
        
        //append the new class to the current namespace
        currentNamespace[className] = subClass;
    };
})();
