define(function (require) {
    var THREE = require('three');
    var gameObjects = require('views/GameModules/gameObjects');


    var World = {
        init: function () {
            var ground = new THREE.PlaneGeometry(2048, 2048);
            var groundMaterial = new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('media/game/textures/grass.jpg')});
            var walls = [
                new THREE.BoxGeometry(2048, 64, 64),
                new THREE.BoxGeometry(2176, 64, 64),
                new THREE.BoxGeometry(2048, 64, 64),
                new THREE.BoxGeometry(2176, 64, 64)
            ];
            var texture_wall = new THREE.TextureLoader().load('media/game/textures/grey_bricks2.jpg');
            texture_wall.wrapS = texture_wall.wrapT = THREE.RepeatWrapping;
            texture_wall.repeat.set(24, 1);
            texture_wall.minFilter = THREE.LinearFilter;
            var wallMaterial = new THREE.MeshPhongMaterial({map: texture_wall});


             this.worldObjects = {
                indestructible_crate: new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('media/game/textures/grey_bricks2.jpg')}),
                destructible_crate: new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load('media/game/textures/destruct_crate.gif')})
            };

            this.addSkybox(); // create a box with panorama

            this.mesh = new THREE.Object3D();
            this.ground = new THREE.Mesh(ground, groundMaterial);
            this.ground.rotation.x = -Math.PI / 2;
            this.mesh.add(this.ground);

            this.walls = [];
            for (var i = 0; i < walls.length; i += 1) {
                this.walls.push(new THREE.Mesh(walls[i], wallMaterial));
                this.walls[i].position.y = 32;
                this.mesh.add(this.walls[i]);
            }

            this.walls[0].rotation.y = -Math.PI / 2;
            this.walls[0].position.x = 1056 ;
            this.walls[1].rotation.y = Math.PI;
            this.walls[1].position.z = 1056;

            this.walls[2].rotation.y = Math.PI / 2;
            this.walls[2].position.x = -1056;

            this.walls[3].position.z = -1056;

            this.obstacles = []; // here we dump all objects in scene

            this.addObjectToWorld(this.worldObjects.destructible_crate, 12, 17);
            this.addObjectToWorld(this.worldObjects.indestructible_crate, 0, 0);
            this.addObjectToWorld(this.worldObjects.destructible_crate, 2, 2);
        },
        addObjectToWorld: function (type, x, z) { // needed to place objects by x,y
            var obj = new THREE.CubeGeometry(64, 64, 64);

            var realObj = new THREE.Mesh(obj, type);
            realObj.position.set(-x * 64 + 992, 32, z * 64 - 992);

            this.obstacles.push(realObj);
            gameObjects.scene.add(realObj);

        },
        getObstacles: function () {
            return this.obstacles.concat(this.walls);
        },
        addSkybox: function () {
            var imagePrefix = "media/game/skybox/panorama/";
            var directions  = ['0004.png',
                '0002.png',
                '0006.png',
                '0005.png',
                '0001.png',
                '0003.png'];
            var skyGeometry = new THREE.BoxGeometry( 5000, 5000, 5000 );
            var materialArray = [];
            for (var i = 0; i < 6; i++)
                materialArray.push( new THREE.MeshBasicMaterial({
                    map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] ),
                    side: THREE.BackSide
                }));
            var skyMaterial = new THREE.MeshFaceMaterial( materialArray );

            var skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
            gameObjects.scene.add( skyBox );
        }
    };
    return World
});