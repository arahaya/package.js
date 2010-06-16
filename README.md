Package.js
======

A simple Javascript class library.
Planned to be a part of [CanvasScript3](http://github.com/arahaya/CanvasScript3)


## Class Example ##

    Class('Cat', function()
    {
        //constructor
        this.Cat = function(name)
        {
            this._name = name;
        };
        
        //getter
        this.__get__name = function()
        {
            return this._name;
        };
    });
    
    var cat = new Cat('Garfield');
    alert(cat.name); // Garfield


## Extends Example ##

    Class('Animal', function()
    {
        //constructor
        this.Animal = function(age)
        {
            this._age = age;
        };
        
        //getter
        this.__get__age = function()
        {
            return this._age;
        };
    });
    
    Class('Cat').Extends(Animal, function()
    {
        //constructor
        this.Cat = function(name, age)
        {
            //call the Animal(super) constructor
            Animal.call(this, age);
            this._name = name;
        };
        
        //getter
        this.__get__name = function()
        {
            return this._name;
        };
    });
    var cat = new Cat('Garfield', 20);
    alert(cat.name); // Garfield
    alert(cat.age); // 20


## Package Example ##

    Package("com.arahaya.js", function()
    {
        Class('Cat', function()
        {
            //constructor
            this.Cat = function(name)
            {
                this._name = name;
            };
            
            //getter
            this.__get__name = function()
            {
                return this._name;
            };
        });
    });
    
    var cat = new com.arahaya.js.Cat('Garfield');
    alert(cat.name); // Garfield


## To Support IE ##

    Class('Cat', function()
    {
        //constructor
        this.Cat = function(name)
        {
            this._name = name;
        };
        
        //getter
        this.__get__name = function()
        {
            return this._name;
        };
    });
    
    var cat = new Cat('Garfield');
    //use a method for getters and setters
    alert(cat.getName()); // Garfield

